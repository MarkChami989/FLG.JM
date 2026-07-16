require('dotenv').config({ quiet: true });
const express = require('express');
const cors = require('cors');

const bookingsRouter = require('./routes/bookings');
const tournamentsRouter = require('./routes/tournaments');
const resourcesRouter = require('./routes/resources');
const staffRouter = require('./routes/staff');
const reportsRouter = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/bookings', bookingsRouter);
app.use('/api/tournaments', tournamentsRouter);
app.use('/api/resources', resourcesRouter);
app.use('/api/staff', staffRouter);
app.use('/api/reports', reportsRouter);

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
