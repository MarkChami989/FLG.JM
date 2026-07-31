const express = require('express');
const db = require('../db');

const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const ROOM_IDS = ['ps', 'pc', 'vip-standard', 'vip-elite', 'vip-royal'];
const CATEGORIES = ['room', 'tabletop', 'lounge-table', 'bar'];

const CATEGORY_LABELS = {
  booking: 'Booking a room, table, or tournament slot',
  'it-support': 'Technical / IT support (PC, PS5, account issues)',
  login: 'Login, verification, or account access issues',
  other: 'General question',
};

const BOOKING_TOOLS = [
  {
    function_declarations: [
      {
        name: 'propose_booking',
        description:
          "Propose a booking once you have enough details from the customer. This does NOT book anything yet — it shows the customer a confirmation card that they must accept themselves. Never tell the customer their booking is confirmed until after you call this and the system confirms availability.",
        parameters: {
          type: 'OBJECT',
          properties: {
            category: { type: 'STRING', enum: CATEGORIES, description: 'room, tabletop, lounge-table, or bar' },
            resourceId: {
              type: 'STRING',
              description: `Required when category is "room" — must be exactly one of: ${ROOM_IDS.join(', ')}. Leave blank for other categories; the system auto-assigns an available table.`,
            },
            activityLabel: { type: 'STRING', description: "Short label, e.g. 'PC Room', 'Ping Pong', 'Bar 1'" },
            date: { type: 'STRING', description: 'Date in YYYY-MM-DD format' },
            hours: {
              type: 'ARRAY',
              items: { type: 'STRING' },
              description: "24-hour hour slots as two-digit strings, e.g. ['18','19'] for a 6pm-8pm booking",
            },
            partySize: { type: 'INTEGER' },
            notes: { type: 'STRING' },
          },
          required: ['category', 'activityLabel', 'date', 'hours'],
        },
      },
    ],
  },
];

function systemPrompt(category) {
  const focus = CATEGORY_LABELS[category] || 'General question';
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const dow = today.toLocaleDateString('en-US', { weekday: 'long' });

  return `You are the live support assistant for Fusion Luxury Game (FLG), a gaming lounge with PC rooms, PS5 rooms, VIP rooms (Standard/Elite/Royal), tournaments, tabletop games (ping pong, billiard, baby foot), and a cigar lounge & bar. `
    + `Today is ${dow}, ${todayStr}. `
    + `Be warm, concise, and helpful. The customer selected this topic: ${focus}. `
    + `If the customer wants to book something, gather: category (room / tabletop / lounge-table / bar), the specific room if category is room (PC Room=pc, PS Room=ps, VIP Standard=vip-standard, VIP Elite=vip-elite, VIP Royal=vip-royal), the date, and the hour(s) in 24-hour format. `
    + `Once you have enough details, call propose_booking — do not say the booking is confirmed yourself, the system shows the customer a card to confirm. `
    + `If propose_booking comes back unavailable, tell the customer that slot is taken and ask for a different date or time — never claim a taken slot is booked. `
    + `For anything you can't fully resolve, tell the customer a staff member will follow up here. Keep replies short (2-4 sentences) unless asked for detail.`;
}

async function callGemini(contents, category) {
  const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt(category) }] },
      tools: BOOKING_TOOLS,
      contents,
    }),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    const err = new Error(`Gemini API error ${response.status}`);
    err.detail = detail;
    throw err;
  }
  return response.json();
}

async function findAvailableResource(category, date, hours, preferredId) {
  const resources = await db.resources().find({ category }).toArray();
  const candidates = preferredId ? resources.filter((r) => r.id === preferredId) : resources;
  for (const r of candidates) {
    const taken = await db.slotBookings().countDocuments({ resourceId: r.id, date, hour: { $in: hours } });
    if (taken === 0) return r;
  }
  return null;
}

async function computePay(category, resourceId, hours) {
  if (category !== 'room') return 0;
  const rate = await db.roomRates().findOne({ category: resourceId });
  return (rate?.pricePerHour || 0) * hours.length;
}

async function handleProposeBooking(args) {
  const { category, resourceId, activityLabel, date, hours, partySize, notes } = args || {};

  if (!CATEGORIES.includes(category)) {
    return { forModel: { error: `category must be one of ${CATEGORIES.join(', ')}` } };
  }
  if (!date || !Array.isArray(hours) || hours.length === 0) {
    return { forModel: { error: 'date and hours are required' } };
  }
  if (category === 'room' && !ROOM_IDS.includes(resourceId)) {
    return { forModel: { error: `resourceId must be one of ${ROOM_IDS.join(', ')} for category "room"` } };
  }

  const resource = await findAvailableResource(category, date, hours, category === 'room' ? resourceId : resourceId || null);
  if (!resource) {
    return {
      forModel: {
        available: false,
        message: 'No matching resource is free for all of those hours. Ask the customer for a different date or time.',
      },
    };
  }

  const pay = await computePay(category, resource.id, hours);
  const proposal = {
    category,
    resourceId: resource.id,
    resourceLabel: resource.title || activityLabel,
    activityLabel,
    date,
    hours,
    partySize: partySize || null,
    notes: notes || '',
    pay,
  };

  return {
    forModel: { available: true, resourceLabel: proposal.resourceLabel, message: 'Proposal shown to the customer as a confirmation card — ask them to confirm it.' },
    proposal,
  };
}

router.post('/chat', async (req, res) => {
  const { messages, category } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  if (!GEMINI_API_KEY) {
    console.log('[ai-support] GEMINI_API_KEY not set — returning fallback reply');
    return res.json({
      reply: "Live support AI isn't configured yet on our end — a staff member will get back to you here as soon as possible.",
      configured: false,
    });
  }

  const contents = messages.map((m) => ({
    role: m.role === 'ai' ? 'model' : 'user',
    parts: [{ text: m.text }],
  }));

  try {
    let data = await callGemini(contents, category);
    let parts = data.candidates?.[0]?.content?.parts || [];
    let bookingProposal = null;

    const functionCallPart = parts.find((p) => p.functionCall);
    if (functionCallPart) {
      const { name, args } = functionCallPart.functionCall;
      const result = name === 'propose_booking' ? await handleProposeBooking(args) : { forModel: { error: 'unknown function' } };
      if (result.proposal) bookingProposal = result.proposal;

      const followUpContents = [
        ...contents,
        { role: 'model', parts: [functionCallPart] },
        { role: 'user', parts: [{ functionResponse: { name, response: result.forModel } }] },
      ];
      data = await callGemini(followUpContents, category);
      parts = data.candidates?.[0]?.content?.parts || [];
    }

    const reply = parts.filter((p) => p.text).map((p) => p.text).join('') || "Sorry, I couldn't come up with a reply — could you rephrase that?";
    res.json({ reply, configured: true, bookingProposal });
  } catch (e) {
    console.error('[ai-support] request failed', e.message, e.detail || '');
    res.status(502).json({ error: 'AI support is temporarily unavailable' });
  }
});

router.post('/confirm-booking', async (req, res) => {
  const { category, resourceId, activityLabel, date, hours, pay, clientUsername } = req.body;
  if (!category || !resourceId || !date || !Array.isArray(hours) || hours.length === 0 || !clientUsername) {
    return res.status(400).json({ error: 'Missing required booking fields' });
  }

  const taken = await db.slotBookings().countDocuments({ resourceId, date, hour: { $in: hours } });
  if (taken > 0) {
    return res.status(409).json({ error: 'One of those time slots was just booked by someone else — please pick a different time.' });
  }

  for (const hour of hours) {
    await db.slotBookings().insertOne({ id: `${resourceId}_${date}_${hour}`, resourceId, date, hour, clientName: clientUsername });
  }

  const typeMap = { 'lounge-table': 'reserve-table', bar: 'reserve-bar' };
  const booking = {
    id: await db.nextBookingId(),
    type: typeMap[category] || category,
    activity: activityLabel,
    user: clientUsername,
    date,
    time: hours.map((h) => `${h}:00`).join(', '),
    resourceId,
    pay: pay || 0,
    paid: false,
    status: 'pending',
  };
  await db.bookings().insertOne(booking);
  const { _id, ...pub } = booking;
  res.status(201).json(pub);
});

module.exports = router;
