const express = require('express');
const db = require('../db');

const router = express.Router();

const TYPE_LABELS = {
  'reserve-bar': 'Lounge',
  'reserve-table': 'Reservations',
  'tournament': 'Tournaments',
  'room': 'Rooms',
  'tabletop': 'Tabletop',
};

router.get('/summary', async (req, res) => {
  const [bookings, staff] = await Promise.all([
    db.bookings().find({}, { projection: { _id: 0 } }).toArray(),
    db.staff().find({}, { projection: { _id: 0 } }).toArray(),
  ]);

  const revenue = bookings.reduce((sum, b) => sum + (b.pay || 0), 0);
  const activeStaff = staff.filter((s) => s.status === 'active').length;

  const days = [];
  const dayCounts = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-US', { weekday: 'short' });
    days.push(label);
    dayCounts.push(bookings.filter((b) => b.date === key).length);
  }
  const maxCount = Math.max(1, ...dayCounts);
  const bars = dayCounts.map((c) => Math.round((c / maxCount) * 100));

  const byType = {};
  bookings.forEach((b) => {
    const label = TYPE_LABELS[b.type] || b.type;
    byType[label] = (byType[label] || 0) + 1;
  });
  const total = bookings.length || 1;
  const breakdown = Object.entries(byType).map(([l, count]) => ({
    l,
    v: Math.round((count / total) * 100),
  }));

  res.json({
    stats: [
      { num: `$${(revenue / 1000).toFixed(1)}K`, lbl: 'Revenue this month' },
      { num: String(bookings.length), lbl: 'Total bookings' },
      { num: String(activeStaff), lbl: 'Active staff' },
      { num: '4.8', lbl: 'Avg client rating' },
    ],
    chart: { days, bars },
    breakdown,
  });
});

module.exports = router;
