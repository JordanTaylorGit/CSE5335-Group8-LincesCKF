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