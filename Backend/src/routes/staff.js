const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(db.data.staff);
});

router.post('/', (req, res) => {
  const { name, role } = req.body;
  if (!name || !role) return res.status(400).json({ error: 'name and role are required' });
  const member = { id: `st-${db.data.staff.length + 1}`, name, role, status: 'active', last: 'Now' };
  db.data.staff.push(member);
  db.save();
  res.status(201).json(member);
});

router.patch('/:id', (req, res) => {
  const member = db.data.staff.find((s) => s.id === req.params.id);
  if (!member) return res.status(404).json({ error: 'Staff member not found' });
  const { status, role, name } = req.body;
  if (status) member.status = status;
  if (role) member.role = role;
  if (name) member.name = name;
  db.save();
  res.json(member);
});

router.delete('/:id', (req, res) => {
  const idx = db.data.staff.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Staff member not found' });
  db.data.staff.splice(idx, 1);
  db.save();
  res.status(204).end();
});

module.exports = router;
