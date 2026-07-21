const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const { user, status } = req.query;
  const filter = {};
  if (user) filter.user = user;
  if (status) filter.status = status;
  const list = await db.bookings().find(filter, { projection: { _id: 0 } }).toArray();
  res.json(list);
});

router.post('/', async (req, res) => {
  const { type, activity, user, date, time, pay, paid } = req.body;
  if (!type || !activity || !user || !date || !time) {
    return res.status(400).json({ error: 'type, activity, user, date, time are required' });
  }
  const booking = {
    id: await db.nextBookingId(),
    type,
    activity,
    user,
    date,
    time,
    pay: pay ?? 0,
    paid: paid ?? false,
    status: 'pending',
  };
  await db.bookings().insertOne(booking);
  const { _id, ...pub } = booking;
  res.status(201).json(pub);
});

router.patch('/:id', async (req, res) => {
  const { status, paid } = req.body;
  const update = {};
  if (status) update.status = status;
  if (paid !== undefined) update.paid = paid;
  const booking = await db.bookings().findOneAndUpdate(
    { id: req.params.id },
    { $set: update },
    { returnDocument: 'after', projection: { _id: 0 } }
  );
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  res.json(booking);
});

router.delete('/:id', async (req, res) => {
  const result = await db.bookings().deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ error: 'Booking not found' });
  res.status(204).end();
});

module.exports = router;
