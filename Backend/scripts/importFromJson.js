require('dotenv').config({ quiet: true });
const fs = require('fs');
const path = require('path');
const { connect } = require('../src/mongo');

const JSON_PATH = path.join(__dirname, '..', '..', 'Database', 'db.json');

async function run() {
  const raw = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));
  const db = await connect();

  const collections = {
    bookings: raw.bookings || [],
    tournaments: raw.tournaments || [],
    resources: raw.resources || [],
    slotBookings: raw.slotBookings || [],
    staff: raw.staff || [],
    clients: raw.clients || [],
  };

  for (const [name, docs] of Object.entries(collections)) {
    const coll = db.collection(name);
    const existing = await coll.countDocuments();
    if (existing > 0) {
      console.log(`Skipping ${name} — already has ${existing} document(s)`);
      continue;
    }
    if (docs.length) await coll.insertMany(docs);
    console.log(`Imported ${docs.length} document(s) into ${name}`);
  }

  const counters = db.collection('counters');
  await counters.updateOne({ _id: 'bookingSeq' }, { $setOnInsert: { seq: raw.nextBookingSeq ?? 0 } }, { upsert: true });
  await counters.updateOne({ _id: 'clientSeq' }, { $setOnInsert: { seq: raw.nextClientSeq ?? 0 } }, { upsert: true });
  console.log(`Counters ready: bookingSeq=${raw.nextBookingSeq ?? 0}, clientSeq=${raw.nextClientSeq ?? 0}`);

  process.exit(0);
}

run().catch((err) => {
  console.error('Import failed:', err);
  process.exit(1);
});
