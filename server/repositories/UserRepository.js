/* Student 1 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

const db = require('../config/db');

class UserRepository {

  static create(user) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO Users 
        (firstName, lastName, email, passwordHash, phone, accountType, companyName, addresses, notificationPreferences) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        user.firstName,
        user.lastName,
        user.email,
        user.passwordHash,
        user.phone,
        user.accountType || 'CUSTOMER',
        user.companyName,
        user.addresses,
        user.notificationPreferences
      ];

      db.query(sql, params, (err, result) => {
        if (err) reject(err);
        else resolve({ id: result.insertId, ...user });
      });
    });
  }

  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM Users WHERE email = ?`,
        [email],
        (err, results) => {
          if (err) reject(err);
          else resolve(results[0]);
        }
      );
    });
  }
}

module.exports = UserRepository;
