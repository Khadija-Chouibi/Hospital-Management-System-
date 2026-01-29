const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',            
  host: 'localhost',
  database: 'hospital',        
  password: 'iwouldbebetter',  
  port: 5432,
});

module.exports = pool;
