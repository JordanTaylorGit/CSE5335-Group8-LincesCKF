const db = require('../config/db');

class UserRepository {
  static async create(user) {
    const sql = `INSERT INTO Users (firstName, lastName, email, passwordHash, phone, accountType, companyName, addresses, notificationPreferences) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      user.firstName, user.lastName, user.email, user.passwordHash, 
      user.phone, user.accountType || 'CUSTOMER', user.companyName, 
      JSON.stringify(user.addresses || []), JSON.stringify(user.notificationPreferences || {})
    ];
    
    const [result] = await db.execute(sql, params);
    return { id: result.insertId, ...user };
  }

  static async findByEmail(email) {
    const [rows] = await db.execute(`SELECT * FROM Users WHERE email = ?`, [email]);
    return rows[0];
  }
}

module.exports = UserRepository;