const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const list = await db.orderRates().find({}, { projection: { _id: 0 } }).toArray();
  res.json(list);
});

router.put('/:group', async (req, res) => {
  const { low, med, high } = req.body;
  for (const v of [low, med, high]) {
    if (typeof v !== 'number' || !(v >= 0)) {
      return res.status(400).json({ error: 'low, med and high must all be non-negative numbers' });
    }
  }
  const rate = await db.orderRates().findOneAndUpdate(
    { group: req.params.group },
    { $set: { group: req.params.group, low, med, high } },
    { upsert: true, returnDocument: 'after', projection: { _id: 0 } }
  );
  res.json(rate);
});

module.exports = router;
