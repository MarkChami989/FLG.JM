const { MongoClient } = require('mongodb');

const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
const DB_NAME = process.env.MONGODB_DB || 'FLG';

const UNIQUE_ID_COLLECTIONS = ['bookings', 'tournaments', 'resources', 'slotBookings', 'staff', 'clients'];

const client = new MongoClient(URI);
let db = null;

async function connect() {
  if (db) return db;
  await client.connect();
  db = client.db(DB_NAME);
  await Promise.all(
    UNIQUE_ID_COLLECTIONS.map((name) => db.collection(name).createIndex({ id: 1 }, { unique: true }))
  );
  return db;
}

function getDb() {
  if (!db) throw new Error('MongoDB not connected yet — call connect() first');
  return db;
}

module.exports = { connect, getDb };
