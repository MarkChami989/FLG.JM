const express = require('express');
const db = require('../db');

const router = express.Router();

async function areContacts(idA, idB) {
  const req = await db.chatRequests().findOne({
    status: 'accepted',
    $or: [
      { fromId: idA, toId: idB },
      { fromId: idB, toId: idA },
    ],
  });
  return !!req;
}

async function findOrCreateDirectConversation(idA, nameA, idB, nameB) {
  const existing = await db.conversations().findOne({
    type: 'direct',
    participants: { $all: [idA, idB], $size: 2 },
  });
  if (existing) return existing;

  const now = Date.now();
  const conversation = {
    id: await db.nextConversationId(),
    type: 'direct',
    participants: [idA, idB],
    participantNames: { [idA]: nameA, [idB]: nameB },
    name: null,
    ownerId: null,
    lastMessage: null,
    createdAt: now,
    updatedAt: now,
  };
  await db.conversations().insertOne(conversation);
  const { _id, ...pub } = conversation;
  return pub;
}

// ---- follow / contact requests ----

router.post('/requests', async (req, res) => {
  const { fromId, fromUsername, toId, toUsername } = req.body;
  if (!fromId || !fromUsername || !toId || !toUsername) {
    return res.status(400).json({ error: 'fromId, fromUsername, toId and toUsername are required' });
  }
  if (fromId === toId) return res.status(400).json({ error: 'Cannot send a request to yourself' });

  if (await areContacts(fromId, toId)) {
    return res.status(409).json({ error: 'Already contacts' });
  }
  const pending = await db.chatRequests().findOne({
    status: 'pending',
    $or: [
      { fromId, toId },
      { fromId: toId, toId: fromId },
    ],
  });
  if (pending) return res.status(409).json({ error: 'A pending request already exists' });

  const request = {
    id: await db.nextChatRequestId(),
    fromId,
    fromUsername,
    toId,
    toUsername,
    status: 'pending',
    createdAt: Date.now(),
    respondedAt: null,
  };
  await db.chatRequests().insertOne(request);
  const { _id, ...pub } = request;

  try {
    require('../sockets').getIO().to(`user:${toId}`).emit('request:new', pub);
  } catch {}

  res.status(201).json(pub);
});

router.get('/requests', async (req, res) => {
  const { userId, direction } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  let filter;
  if (direction === 'incoming') filter = { toId: userId, status: 'pending' };
  else if (direction === 'outgoing') filter = { fromId: userId, status: 'pending' };
  else filter = { status: 'pending', $or: [{ fromId: userId }, { toId: userId }] };

  const list = await db.chatRequests().find(filter, { projection: { _id: 0 } }).toArray();
  res.json(list);
});

router.patch('/requests/:id', async (req, res) => {
  const { action, userId } = req.body;
  if (!['accept', 'decline'].includes(action) || !userId) {
    return res.status(400).json({ error: 'action (accept|decline) and userId are required' });
  }
  const request = await db.chatRequests().findOne({ id: req.params.id });
  if (!request) return res.status(404).json({ error: 'Request not found' });
  if (request.toId !== userId) return res.status(403).json({ error: 'Only the recipient can respond to this request' });
  if (request.status !== 'pending') return res.status(400).json({ error: 'Request already responded to' });

  const status = action === 'accept' ? 'accepted' : 'declined';
  const updated = await db.chatRequests().findOneAndUpdate(
    { id: req.params.id },
    { $set: { status, respondedAt: Date.now() } },
    { returnDocument: 'after', projection: { _id: 0 } }
  );

  if (action === 'decline') return res.json({ request: updated });

  const conversation = await findOrCreateDirectConversation(
    request.fromId, request.fromUsername,
    request.toId, request.toUsername
  );

  try {
    require('../sockets').getIO().to(`user:${request.fromId}`).emit('request:accepted', { request: updated, conversation });
  } catch {}

  res.json({ request: updated, conversation });
});

// ---- conversations ----

router.get('/conversations', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  const list = await db.conversations().find(
    { participants: userId },
    { projection: { _id: 0 } }
  ).sort({ updatedAt: -1 }).toArray();

  const withUnread = await Promise.all(list.map(async (c) => {
    const unread = await db.messages().countDocuments({
      conversationId: c.id,
      fromId: { $ne: userId },
      readBy: { $ne: userId },
    });
    return { ...c, unread };
  }));

  res.json(withUnread);
});

router.post('/conversations/group', async (req, res) => {
  const { ownerId, ownerUsername, name, members } = req.body;
  if (!ownerId || !ownerUsername || !name || !Array.isArray(members) || members.length < 1) {
    return res.status(400).json({ error: 'ownerId, ownerUsername, name and at least one member ({id, username}) are required' });
  }

  const checks = await Promise.all(members.map(async (m) => ({ id: m.id, ok: await areContacts(ownerId, m.id) })));
  const notContacts = checks.filter((c) => !c.ok).map((c) => c.id);
  if (notContacts.length > 0) {
    return res.status(400).json({ error: `Not accepted contacts: ${notContacts.join(', ')}` });
  }

  const participantNames = { [ownerId]: ownerUsername };
  members.forEach((m) => { participantNames[m.id] = m.username; });

  const now = Date.now();
  const conversation = {
    id: await db.nextConversationId(),
    type: 'group',
    name,
    ownerId,
    participants: [ownerId, ...members.map((m) => m.id)],
    participantNames,
    lastMessage: null,
    createdAt: now,
    updatedAt: now,
  };
  await db.conversations().insertOne(conversation);
  const { _id, ...pub } = conversation;
  res.status(201).json(pub);
});

// ---- messages ----

router.get('/conversations/:id/messages', async (req, res) => {
  const { userId, before, limit } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  const conversation = await db.conversations().findOne({ id: req.params.id });
  if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
  if (!conversation.participants.includes(userId)) return res.status(403).json({ error: 'Not a participant' });

  const filter = { conversationId: req.params.id };
  if (before) filter.id = { $lt: before };

  const list = await db.messages().find(filter, { projection: { _id: 0 } })
    .sort({ id: -1 })
    .limit(Math.min(Number(limit) || 30, 100))
    .toArray();

  res.json(list.reverse());
});

router.post('/conversations/:id/messages', async (req, res) => {
  const { fromId, fromUsername, text } = req.body;
  if (!fromId || !fromUsername || !text || !String(text).trim()) {
    return res.status(400).json({ error: 'fromId, fromUsername and text are required' });
  }

  const conversation = await db.conversations().findOne({ id: req.params.id });
  if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
  if (!conversation.participants.includes(fromId)) return res.status(403).json({ error: 'Not a participant' });

  const message = {
    id: await db.nextMessageId(),
    conversationId: req.params.id,
    fromId,
    fromUsername,
    text: String(text).trim(),
    createdAt: Date.now(),
    readBy: [fromId],
  };
  await db.messages().insertOne(message);
  const { _id, ...pub } = message;

  const lastMessage = { text: pub.text, fromId, createdAt: pub.createdAt };
  await db.conversations().updateOne(
    { id: req.params.id },
    { $set: { lastMessage, updatedAt: pub.createdAt } }
  );

  try {
    require('../sockets').getIO().to(`conv:${req.params.id}`).emit('message:new', pub);
  } catch {}

  res.status(201).json(pub);
});

router.post('/conversations/:id/read', async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  const conversation = await db.conversations().findOne({ id: req.params.id });
  if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
  if (!conversation.participants.includes(userId)) return res.status(403).json({ error: 'Not a participant' });

  await db.messages().updateMany(
    { conversationId: req.params.id, readBy: { $ne: userId } },
    { $addToSet: { readBy: userId } }
  );

  try {
    require('../sockets').getIO().to(`conv:${req.params.id}`).emit('message:read', { conversationId: req.params.id, userId });
  } catch {}

  res.json({ ok: true });
});

module.exports = router;
