/* Student 1 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

const db = require('../config/db');

class ProductRepository {

  static findAll() {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM Products`, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static findByBrand(brandId) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM Products WHERE brandId = ?`,
        [brandId],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
  }

  static create(product) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO Products 
        (name, description, price, category, material, images, stockQuantity, sizes, colors, brandId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(sql, [
        product.name,
        product.description,
        product.price,
        product.category,
        product.material,
        product.images ? JSON.stringify(product.images) : '[]',
        product.stockQuantity || 0,
        product.sizes ? JSON.stringify(product.sizes) : '[]',
        product.colors ? JSON.stringify(product.colors) : '[]',
        product.brandId
      ], (err, result) => {
        if (err) reject(err);
        else resolve(result.insertId);
      });
    });
  }
}

module.exports = ProductRepository;