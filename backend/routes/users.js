const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Configure your PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'hospital',
  password: '123456789',
  port: 5500, // Use the port you confirmed
});

// Register a new user (optional)
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO "Users" (firstName, lastName, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [firstName, lastName, email, password, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2 AND role = $3',
      [email, password, role]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = result.rows[0];
    res.json({
      userID: user.userid,
      email: user.email,
      role: user.role,
      firstName: user.firstname,
      lastName: user.lastname
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

module.exports = router;

