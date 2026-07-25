const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const list = await db.roomRates().find({}, { projection: { _id: 0 } }).toArray();
  res.json(list);
});

router.put('/:category', async (req, res) => {
  const { pricePerHour } = req.body;
  if (typeof pricePerHour !== 'number' || !(pricePerHour >= 0)) {
    return res.status(400).json({ error: 'pricePerHour must be a non-negative number' });
  }
  const rate = await db.roomRates().findOneAndUpdate(
    { category: req.params.category },
    { $set: { category: req.params.category, pricePerHour } },
    { upsert: true, returnDocument: 'after', projection: { _id: 0 } }
  );
  res.json(rate);
});

module.exports = router;
