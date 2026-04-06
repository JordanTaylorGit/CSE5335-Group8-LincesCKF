const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run('PRAGMA foreign_keys = ON');
    initializeSchema();
  }
});

function initializeSchema() {
  db.serialize(() => {
    // Users Table
    db.run(`CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT,
      lastName TEXT,
      email TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      phone TEXT,
      accountType TEXT DEFAULT 'CUSTOMER',
      companyName TEXT,
      addresses TEXT,
      notificationPreferences TEXT
    )`);

    // Products Table
    db.run(`CREATE TABLE IF NOT EXISTS Products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT,
      material TEXT,
      images TEXT,
      stockQuantity INTEGER DEFAULT 0,
      sizes TEXT,
      colors TEXT
    )`);

    // Orders Table
    db.run(`CREATE TABLE IF NOT EXISTS Orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      items TEXT NOT NULL,
      totalAmount REAL NOT NULL,
      status TEXT DEFAULT 'Pending',
      shippingAddress TEXT,
      paymentStatus TEXT DEFAULT 'Pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES Users(id)
    )`);

    // Custom Orders Table
    db.run(`CREATE TABLE IF NOT EXISTS CustomOrders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      orderType TEXT NOT NULL,
      contactInfo TEXT,
      requirements TEXT,
      status TEXT DEFAULT 'New',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES Users(id)
    )`);

    // Contact Messages Table
    db.run(`CREATE TABLE IF NOT EXISTS ContactMessages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'Unread',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    console.log('Database schema initialized.');
  });
}

module.exports = db;