const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const { search, excludeId } = req.query;
  const filter = {};
  if (search) filter.username = { $regex: String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
  if (excludeId) filter.id = { $ne: excludeId };
  const list = await db.clients().find(filter, { projection: { id: 1, username: 1, _id: 0 } }).limit(20).toArray();
  res.json(list);
});

module.exports = router;
