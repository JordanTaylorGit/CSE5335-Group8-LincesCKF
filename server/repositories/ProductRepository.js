const db = require('../config/db');

class ProductRepository {
  static findAll() {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM Products`, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}

module.exports = ProductRepository;