const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { Pool } = require('pg');

const app = express();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'hospital',
  password: 'iwouldbebetter',
  port: 5500,
});

// Test DB connection and table existence on startup
pool.query('SELECT 1 FROM users LIMIT 1')
  .then(() => {
    console.log('Database connection and users table OK');
  })
  .catch(err => {
    console.error('Database connection or users table error:', err);
    process.exit(1); // Stop server if DB/table is not accessible
  });

const userRoutes = require('./routes/users');
const appointmentRoutes = require('./routes/appointments');

// Enable CORS for your frontend origin
app.use(cors({
  origin: 'http://127.0.0.1:5501', // Frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Serve frontend files statically
app.use(express.static(path.join(__dirname, '../frontend')));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

