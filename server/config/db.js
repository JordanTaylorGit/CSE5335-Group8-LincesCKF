const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password', // Update this to match your local MySQL password
  database: 'linces_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(connection => {
    console.log('Connected to the MySQL database.');
    connection.release();
  })
  .catch(err => {
    console.error('Error opening database:', err.message);
  });

module.exports = pool;