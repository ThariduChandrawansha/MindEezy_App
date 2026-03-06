const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'psychology_care'
  });
  try {
    const [rows, fields] = await conn.query("SHOW COLUMNS FROM users LIKE 'status'");
    if (rows.length === 0) {
      await conn.query("ALTER TABLE users ADD COLUMN status ENUM('active', 'deactive') DEFAULT 'active'");
      console.log('Column added');
    } else {
      console.log('Column already exists');
    }
  } catch(e) {
    console.log(e.message);
  }
  conn.end();
}
run();
