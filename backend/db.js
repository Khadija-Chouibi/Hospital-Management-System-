const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',            
  host: 'localhost',
  database: 'hospital',        
  password: '123456789',  
  port: 5432,
});

module.exports = pool;
