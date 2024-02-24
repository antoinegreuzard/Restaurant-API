const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: '3306',
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error(`Error connecting: ${err.stack}`);
    return;
  }

  console.log(`Connected as id ${db.threadId}`);
});

module.exports = db;
