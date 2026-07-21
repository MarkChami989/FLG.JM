const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const list = await db.tournaments().find({}, { projection: { _id: 0 } }).toArray();
  res.json(list);
});

router.post('/', async (req, res) => {
  const { name, max, cost } = req.body;
  if (!name || !max || cost === undefined) {
    return res.status(400).json({ error: 'name, max, cost are required' });
  }
  const count = await db.tournaments().countDocuments();
  const id = `T-${String(count + 1).padStart(3, '0')}`;
  const tournament = { id, name, max: Number(max), cost: Number(cost), clients: [] };
  await db.tournaments().insertOne(tournament);
  const { _id, ...pub } = tournament;
  res.status(201).json(pub);
});

router.patch('/:id', async (req, res) => {
  const { name, max, cost } = req.body;
  const update = {};
  if (name !== undefined) update.name = name;
  if (max !== undefined) update.max = Number(max);
  if (cost !== undefined) update.cost = Number(cost);
  const t = await db.tournaments().findOneAndUpdate(
    { id: req.params.id },
    { $set: update },
    { returnDocument: 'after', projection: { _id: 0 } }
  );
  if (!t) return res.status(404).json({ error: 'Tournament not found' });
  res.json(t);
});

router.delete('/:id', async (req, res) => {
  const result = await db.tournaments().deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ error: 'Tournament not found' });
  res.status(204).end();
});

// join tournament
router.post('/:id/clients', async (req, res) => {
  const { user, uid } = req.body;
  if (!user || !uid) return res.status(400).json({ error: 'user and uid are required' });

  const t = await db.tournaments().findOne({ id: req.params.id });
  if (!t) return res.status(404).json({ error: 'Tournament not found' });
  if (t.clients.length >= t.max) return res.status(409).json({ error: 'Tournament full' });

  const existing = t.clients.find((c) => c.uid === uid);
  let updated;
  if (existing) {
    updated = await db.tournaments().findOneAndUpdate(
      { id: req.params.id, 'clients.uid': uid },
      { $inc: { 'clients.$.times': 1 } },
      { returnDocument: 'after', projection: { _id: 0 } }
    );
  } else {
    const newClient = { user, uid, times: 1, rank: t.clients.length + 1 };
    updated = await db.tournaments().findOneAndUpdate(
      { id: req.params.id },
      { $push: { clients: newClient } },
      { returnDocument: 'after', projection: { _id: 0 } }
    );
  }
  res.status(201).json(updated);
});

router.patch('/:id/clients/:uid', async (req, res) => {
  const t = await db.tournaments().findOne({ id: req.params.id });
  if (!t) return res.status(404).json({ error: 'Tournament not found' });
  const client = t.clients.find((c) => c.uid === req.params.uid);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  const { rank } = req.body;
  if (rank !== undefined) {
    await db.tournaments().updateOne(
      { id: req.params.id, 'clients.uid': req.params.uid },
      { $set: { 'clients.$.rank': Number(rank) } }
    );
  }
  const updated = await db.tournaments().findOne({ id: req.params.id }, { projection: { _id: 0 } });
  res.json(updated);
});

router.delete('/:id/clients/:uid', async (req, res) => {
  const t = await db.tournaments().findOneAndUpdate(
    { id: req.params.id },
    { $pull: { clients: { uid: req.params.uid } } },
    { returnDocument: 'after', projection: { _id: 0 } }
  );
  if (!t) return res.status(404).json({ error: 'Tournament not found' });
  res.json(t);
});

module.exports = router;
