const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const { category } = req.query;
  const filter = {};
  if (category) filter.category = category;
  const list = await db.resources().find(filter, { projection: { _id: 0 } }).toArray();
  res.json(list);
});

router.patch('/:id', async (req, res) => {
  const { status } = req.body;
  const update = {};
  if (status) update.status = status;
  const resource = await db.resources().findOneAndUpdate(
    { id: req.params.id },
    { $set: update },
    { returnDocument: 'after', projection: { _id: 0 } }
  );
  if (!resource) return res.status(404).json({ error: 'Resource not found' });
  res.json(resource);
});

// hourly slot bookings for a resource (rooms + tabletop calendar)
router.get('/:id/slots', async (req, res) => {
  const { date } = req.query;
  const filter = { resourceId: req.params.id };
  if (date) filter.date = date;
  const list = await db.slotBookings().find(filter, { projection: { _id: 0 } }).toArray();
  res.json(list);
});

router.post('/:id/slots', async (req, res) => {
  const { date, hour, clientName } = req.body;
  if (!date || !hour || !clientName) {
    return res.status(400).json({ error: 'date, hour, clientName are required' });
  }
  const existing = await db.slotBookings().findOne({ resourceId: req.params.id, date, hour });
  if (existing) return res.status(409).json({ error: 'Slot already booked' });
  const slot = { id: `${req.params.id}_${date}_${hour}`, resourceId: req.params.id, date, hour, clientName };
  await db.slotBookings().insertOne(slot);
  const { _id, ...pub } = slot;
  res.status(201).json(pub);
});

router.patch('/:id/slots/:slotId', async (req, res) => {
  const { clientName } = req.body;
  const update = {};
  if (clientName) update.clientName = clientName;
  const slot = await db.slotBookings().findOneAndUpdate(
    { id: req.params.slotId, resourceId: req.params.id },
    { $set: update },
    { returnDocument: 'after', projection: { _id: 0 } }
  );
  if (!slot) return res.status(404).json({ error: 'Slot not found' });
  res.json(slot);
});

router.delete('/:id/slots/:slotId', async (req, res) => {
  const result = await db.slotBookings().deleteOne({ id: req.params.slotId, resourceId: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ error: 'Slot not found' });
  res.status(204).end();
});

module.exports = router;
