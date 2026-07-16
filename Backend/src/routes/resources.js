const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  const { category } = req.query;
  let list = db.data.resources;
  if (category) list = list.filter((r) => r.category === category);
  res.json(list);
});

router.patch('/:id', (req, res) => {
  const resource = db.data.resources.find((r) => r.id === req.params.id);
  if (!resource) return res.status(404).json({ error: 'Resource not found' });
  const { status } = req.body;
  if (status) resource.status = status;
  db.save();
  res.json(resource);
});

// hourly slot bookings for a resource (rooms + tabletop calendar)
router.get('/:id/slots', (req, res) => {
  const { date } = req.query;
  let list = db.data.slotBookings.filter((s) => s.resourceId === req.params.id);
  if (date) list = list.filter((s) => s.date === date);
  res.json(list);
});

router.post('/:id/slots', (req, res) => {
  const { date, hour, clientName } = req.body;
  if (!date || !hour || !clientName) {
    return res.status(400).json({ error: 'date, hour, clientName are required' });
  }
  const existing = db.data.slotBookings.find(
    (s) => s.resourceId === req.params.id && s.date === date && s.hour === hour
  );
  if (existing) return res.status(409).json({ error: 'Slot already booked' });
  const slot = { id: `${req.params.id}_${date}_${hour}`, resourceId: req.params.id, date, hour, clientName };
  db.data.slotBookings.push(slot);
  db.save();
  res.status(201).json(slot);
});

router.patch('/:id/slots/:slotId', (req, res) => {
  const slot = db.data.slotBookings.find((s) => s.id === req.params.slotId && s.resourceId === req.params.id);
  if (!slot) return res.status(404).json({ error: 'Slot not found' });
  const { clientName } = req.body;
  if (clientName) slot.clientName = clientName;
  db.save();
  res.json(slot);
});

router.delete('/:id/slots/:slotId', (req, res) => {
  const idx = db.data.slotBookings.findIndex((s) => s.id === req.params.slotId && s.resourceId === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Slot not found' });
  db.data.slotBookings.splice(idx, 1);
  db.save();
  res.status(204).end();
});

module.exports = router;
