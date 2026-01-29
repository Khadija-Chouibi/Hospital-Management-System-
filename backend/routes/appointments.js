const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'hospital',
  password: 'iwouldbebetter',
  port: 5500,
});

// Get all appointments
router.get('/', async (req, res) => {
  console.log('GET /api/appointments called');
  try {
    const result = await db.query('SELECT * FROM appointment ORDER BY "createdat" DESC');
    console.log('Fetched appointments:', result.rows.length);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create appointment
router.post('/', async (req, res) => {
  console.log('POST /api/appointments called');
  console.log('Request headers:', req.headers);
  console.log('Raw request body:', req.body);

  let { doctorID, patientID, nurseID, dateTime, status, diagnosis } = req.body;

  // Log types and values
  console.log('Received values:', {
    doctorID, patientID, nurseID, dateTime, status, diagnosis
  });

  // Convert IDs to integers and log
  doctorID = parseInt(doctorID);
  patientID = parseInt(patientID);
  nurseID = nurseID ? parseInt(nurseID) : null;
  console.log('Parsed IDs:', { doctorID, patientID, nurseID });

  // Validate status and log
  const validStatuses = ['upcoming', 'completed', 'canceled'];
  if (!validStatuses.includes(status)) {
    console.error('Invalid status:', status);
    return res.status(400).json({ error: 'Invalid status value', received: status });
  }

  // Log the final data to be inserted
  console.log('Final data to insert:', {
    doctorID, patientID, nurseID, dateTime, status, diagnosis
  });

  // Log the SQL query and parameters
  const sql = `
    INSERT INTO appointment
      (doctorid, patientid, nurseid, datetime, status, diagnosis, createdat, updatedat)
    VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING *`;
  const params = [doctorID, patientID, nurseID, dateTime, status, diagnosis];
  console.log('SQL:', sql);
  console.log('Params:', params);

  try {
    const result = await db.query(sql, params);
    console.log('Insert result:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting appointment:', err);
    res.status(500).json({ error: err.message, details: err.detail });
  }
});

// Update appointment (admin)
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { doctorID, patientID, nurseID, dateTime, status, diagnosis } = req.body;
  console.log('PUT /api/appointments/' + id, req.body);

  try {
    const result = await db.query(
      `UPDATE appointment
       SET doctorid=$1, patientid=$2, nurseid=$3, datetime=$4, status=$5, diagnosis=$6, updatedat=CURRENT_TIMESTAMP
       WHERE appointmentid=$7
       RETURNING *`,
      [doctorID, patientID, nurseID, dateTime, status, diagnosis, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating appointment:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
