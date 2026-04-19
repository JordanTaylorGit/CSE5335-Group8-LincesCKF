const db = require('../config/db');

class ProductRepository {
  static async findAll() {
    const [rows] = await db.execute(`SELECT * FROM Products`);
    return rows;
  }

  static async findByBrandId(brandId) {
    const [rows] = await db.execute(`SELECT * FROM Products WHERE brandId = ?`, [brandId]);
    return rows;
  }

  static async create(product) {
    const sql = `
      INSERT INTO Products (name, description, price, category, material, images, stockQuantity, sizes, colors, brandId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      product.name,
      product.description,
      product.price,
      product.category,
      product.material,
      JSON.stringify(product.images || []),
      product.stockQuantity || 0,
      JSON.stringify(product.sizes || []),
      JSON.stringify(product.colors || []),
      product.brandId
    ];
    
    const [result] = await db.execute(sql, params);
    return { id: result.insertId, ...product };
  }
}

module.exports = ProductRepository;