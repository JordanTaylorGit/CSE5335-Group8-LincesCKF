const db = require('../config/db');

class UserRepository {
  static create(user) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO Users (firstName, lastName, email, passwordHash, phone, accountType, companyName, addresses, notificationPreferences) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const params = [
        user.firstName, user.lastName, user.email, user.passwordHash, 
        user.phone, user.accountType || 'CUSTOMER', user.companyName, 
        user.addresses, user.notificationPreferences
      ];
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...user });
      });
    });
  }

  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM Users WHERE email = ?`, [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
}

module.exports = UserRepository;