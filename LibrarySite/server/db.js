require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'inked_db',
  password: process.env.DB_PASSWORD,
  port: 1234,
});
module.exports = pool;
// Функція для перевірки зв'язку
const testConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Зв’язок встановлено:', res.rows[0]);
  } catch (err) {
    console.error('Помилка підключення:', err);
  }
};

testConnection();

module.exports = pool;