require('dotenv').config({ quiet: true });
const http = require('http');
const express = require('express');
const cors = require('cors');
const { connect } = require('./mongo');
const { initSockets } = require('./sockets');

const bookingsRouter = require('./routes/bookings');
const tournamentsRouter = require('./routes/tournaments');
const resourcesRouter = require('./routes/resources');
const roomRatesRouter = require('./routes/roomRates');
const orderRatesRouter = require('./routes/orderRates');
const staffRouter = require('./routes/staff');
const staffAuthRouter = require('./routes/staffAuth');
const reportsRouter = require('./routes/reports');
const authRouter = require('./routes/auth');
const adminAuthRouter = require('./routes/adminAuth');
const clientsRouter = require('./routes/clients');
const chatRouter = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '25mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/bookings', bookingsRouter);
app.use('/api/tournaments', tournamentsRouter);
app.use('/api/resources', resourcesRouter);
app.use('/api/room-rates', roomRatesRouter);
app.use('/api/order-rates', orderRatesRouter);
app.use('/api/staff', staffRouter);
app.use('/api/staff-auth', staffAuthRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin-auth', adminAuthRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/chat', chatRouter);

connect()
  .then(() => {
    const httpServer = http.createServer(app);
    initSockets(httpServer);
    httpServer.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
