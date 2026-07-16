const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  const { user, status } = req.query;
  let list = db.data.bookings;
  if (user) list = list.filter((b) => b.user === user);
  if (status) list = list.filter((b) => b.status === status);
  res.json(list);
});

router.post('/', (req, res) => {
  const { type, activity, user, date, time, pay, paid } = req.body;
  if (!type || !activity || !user || !date || !time) {
    return res.status(400).json({ error: 'type, activity, user, date, time are required' });
  }
  const booking = {
    id: db.nextBookingId(),
    type,
    activity,
    user,
    date,
    time,
    pay: pay ?? 0,
    paid: paid ?? false,
    status: 'pending',
  };
  db.data.bookings.push(booking);
  db.save();
  res.status(201).json(booking);
});

router.patch('/:id', (req, res) => {
  const booking = db.data.bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  const { status, paid } = req.body;
  if (status) booking.status = status;
  if (paid !== undefined) booking.paid = paid;
  db.save();
  res.json(booking);
});

router.delete('/:id', (req, res) => {
  const idx = db.data.bookings.findIndex((b) => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Booking not found' });
  db.data.bookings.splice(idx, 1);
  db.save();
  res.status(204).end();
});

module.exports = router;
