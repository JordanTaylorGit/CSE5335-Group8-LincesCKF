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

  static findByBrand(brandId) {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM Products WHERE brandId = ?`, [brandId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static create(product) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO Products (name, description, price, category, material, images, stockQuantity, sizes, colors, brandId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.run(sql, [
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
      ], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  }
}

module.exports = ProductRepository;