const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./medbuddy.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS medications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      name TEXT,
      dosage TEXT,
      frequency TEXT,
      takenDates TEXT,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);
});

module.exports = db;
