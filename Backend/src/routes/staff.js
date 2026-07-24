const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');

const router = express.Router();

function byEmailCaseInsensitive(email) {
  return { $expr: { $eq: [{ $toLower: '$email' }, email.toLowerCase()] } };
}

function publicStaff(s) {
  const { passwordHash, otpCode, otpExpiresAt, _id, ...pub } = s;
  return pub;
}

router.get('/', async (req, res) => {
  const list = await db.staff().find({}, {
    projection: { _id: 0, passwordHash: 0, otpCode: 0, otpExpiresAt: 0, frontId: 0, backId: 0 },
  }).toArray();
  res.json(list);
});

router.get('/:id', async (req, res) => {
  const member = await db.staff().findOne({ id: req.params.id }, { projection: { _id: 0 } });
  if (!member) return res.status(404).json({ error: 'Staff member not found' });
  res.json(publicStaff(member));
});

router.post('/', async (req, res) => {
  const { name, username, password, email, phone, frontId, backId } = req.body;
  if (!name || !username || !password || !email || !phone || !frontId || !backId) {
    return res.status(400).json({ error: 'name, username, password, email, phone, frontId and backId are required' });
  }
  const exists = await db.staff().findOne({ $or: [byEmailCaseInsensitive(email), { username }] });
  if (exists) return res.status(409).json({ error: 'Username or email already registered' });

  const passwordHash = await bcrypt.hash(password, 10);
  const count = await db.staff().countDocuments();
  const member = {
    id: `st-${count + 1}`,
    name,
    username,
    passwordHash,
    email,
    phone,
    frontId,
    backId,
    status: 'active',
    createdAt: Date.now(),
  };
  await db.staff().insertOne(member);
  res.status(201).json(publicStaff(member));
});

router.patch('/:id', async (req, res) => {
  const { status, name, email, phone } = req.body;
  const update = {};
  if (status) update.status = status;
  if (name) update.name = name;
  if (email) update.email = email;
  if (phone) update.phone = phone;
  const member = await db.staff().findOneAndUpdate(
    { id: req.params.id },
    { $set: update },
    { returnDocument: 'after', projection: { _id: 0 } }
  );
  if (!member) return res.status(404).json({ error: 'Staff member not found' });
  res.json(publicStaff(member));
});

router.delete('/:id', async (req, res) => {
  const result = await db.staff().deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ error: 'Staff member not found' });
  res.status(204).end();
});

module.exports = router;
