const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(db.data.tournaments);
});

router.post('/', (req, res) => {
  const { name, max, cost } = req.body;
  if (!name || !max || cost === undefined) {
    return res.status(400).json({ error: 'name, max, cost are required' });
  }
  const id = `T-${String(db.data.tournaments.length + 1).padStart(3, '0')}`;
  const tournament = { id, name, max: Number(max), cost: Number(cost), clients: [] };
  db.data.tournaments.push(tournament);
  db.save();
  res.status(201).json(tournament);
});

router.patch('/:id', (req, res) => {
  const t = db.data.tournaments.find((x) => x.id === req.params.id);
  if (!t) return res.status(404).json({ error: 'Tournament not found' });
  const { name, max, cost } = req.body;
  if (name !== undefined) t.name = name;
  if (max !== undefined) t.max = Number(max);
  if (cost !== undefined) t.cost = Number(cost);
  db.save();
  res.json(t);
});

router.delete('/:id', (req, res) => {
  const idx = db.data.tournaments.findIndex((x) => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Tournament not found' });
  db.data.tournaments.splice(idx, 1);
  db.save();
  res.status(204).end();
});

// join tournament
router.post('/:id/clients', (req, res) => {
  const t = db.data.tournaments.find((x) => x.id === req.params.id);
  if (!t) return res.status(404).json({ error: 'Tournament not found' });
  const { user, uid } = req.body;
  if (!user || !uid) return res.status(400).json({ error: 'user and uid are required' });
  if (t.clients.length >= t.max) return res.status(409).json({ error: 'Tournament full' });
  const existing = t.clients.find((c) => c.uid === uid);
  if (existing) existing.times += 1;
  else t.clients.push({ user, uid, times: 1, rank: t.clients.length + 1 });
  db.save();
  res.status(201).json(t);
});

router.patch('/:id/clients/:uid', (req, res) => {
  const t = db.data.tournaments.find((x) => x.id === req.params.id);
  if (!t) return res.status(404).json({ error: 'Tournament not found' });
  const client = t.clients.find((c) => c.uid === req.params.uid);
  if (!client) return res.status(404).json({ error: 'Client not found' });
  const { rank } = req.body;
  if (rank !== undefined) client.rank = Number(rank);
  db.save();
  res.json(t);
});

router.delete('/:id/clients/:uid', (req, res) => {
  const t = db.data.tournaments.find((x) => x.id === req.params.id);
  if (!t) return res.status(404).json({ error: 'Tournament not found' });
  t.clients = t.clients.filter((c) => c.uid !== req.params.uid);
  db.save();
  res.json(t);
});

module.exports = router;
