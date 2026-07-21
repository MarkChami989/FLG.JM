const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const list = await db.staff().find({}, { projection: { _id: 0 } }).toArray();
  res.json(list);
});

router.post('/', async (req, res) => {
  const { name, role } = req.body;
  if (!name || !role) return res.status(400).json({ error: 'name and role are required' });
  const count = await db.staff().countDocuments();
  const member = { id: `st-${count + 1}`, name, role, status: 'active', last: 'Now' };
  await db.staff().insertOne(member);
  const { _id, ...pub } = member;
  res.status(201).json(pub);
});

router.patch('/:id', async (req, res) => {
  const { status, role, name } = req.body;
  const update = {};
  if (status) update.status = status;
  if (role) update.role = role;
  if (name) update.name = name;
  const member = await db.staff().findOneAndUpdate(
    { id: req.params.id },
    { $set: update },
    { returnDocument: 'after', projection: { _id: 0 } }
  );
  if (!member) return res.status(404).json({ error: 'Staff member not found' });
  res.json(member);
});

router.delete('/:id', async (req, res) => {
  const result = await db.staff().deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ error: 'Staff member not found' });
  res.status(204).end();
});

module.exports = router;
