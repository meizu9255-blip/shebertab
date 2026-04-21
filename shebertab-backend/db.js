const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Дерекқорға (PostgreSQL) қосылу қателігі:', err.stack);
  } else {
    console.log('PostgreSQL дерекқорына сәтті қосылды');
    release();
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
