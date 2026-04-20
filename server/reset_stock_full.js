/* Student 1 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

require('dotenv').config();

const mysql = require('mysql2/promise');

const FULL_STOCK_PER_SIZE = Number.parseInt(process.env.FULL_STOCK_PER_SIZE || '10', 10);
const FULL_STOCK_DEFAULT = Number.parseInt(process.env.FULL_STOCK_DEFAULT || '50', 10);

function parseJson(value, fallback) {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value !== 'string') return value;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function clampStock(value, fallback) {
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}

function refillSizes(rawSizes, stockPerSize) {
  if (!Array.isArray(rawSizes)) {
    return { sizes: [], totalStock: null };
  }

  const sizes = rawSizes
    .map((entry) => {
      if (typeof entry === 'string') {
        const name = entry.trim();
        return name ? { name, stockQuantity: stockPerSize } : null;
      }

      if (!entry || typeof entry !== 'object') return null;

      const name = String(entry.name || entry.size || entry.label || '').trim();
      if (!name) return null;

      return {
        ...entry,
        name,
        stockQuantity: stockPerSize,
      };
    })
    .filter(Boolean);

  if (!sizes.length) {
    return { sizes: [], totalStock: null };
  }

  return {
    sizes,
    totalStock: sizes.length * stockPerSize,
  };
}

async function main() {
  const stockPerSize = clampStock(FULL_STOCK_PER_SIZE, 10);
  const defaultStock = clampStock(FULL_STOCK_DEFAULT, 50);

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const [products] = await connection.execute(
      `SELECT product_id, name_en, stock_quantity, sizes_json FROM products ORDER BY product_id ASC`
    );

    let updatedCount = 0;

    for (const product of products) {
      const parsedSizes = parseJson(product.sizes_json, []);
      const refilled = refillSizes(parsedSizes, stockPerSize);
      const nextStock = refilled.totalStock === null ? defaultStock : refilled.totalStock;
      const nextSizesJson = refilled.totalStock === null
        ? JSON.stringify(Array.isArray(parsedSizes) ? parsedSizes : [])
        : JSON.stringify(refilled.sizes);

      await connection.execute(
        `UPDATE products SET stock_quantity = ?, sizes_json = ? WHERE product_id = ?`,
        [nextStock, nextSizesJson, product.product_id]
      );

      updatedCount += 1;
      console.log(
        `Refilled product ${product.product_id} (${product.name_en}) to ${nextStock} item(s)`
      );
    }

    const [summaryRows] = await connection.execute(
      `SELECT COUNT(*) AS productCount, MIN(stock_quantity) AS minStock, MAX(stock_quantity) AS maxStock FROM products`
    );
    const summary = summaryRows[0] || {};

    console.log('');
    console.log(`Updated ${updatedCount} product(s).`);
    console.log(
      `Inventory summary: products=${summary.productCount || 0}, minStock=${summary.minStock || 0}, maxStock=${summary.maxStock || 0}`
    );
    console.log(`Per-size refill level: ${stockPerSize}`);
    console.log(`Default refill level: ${defaultStock}`);
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error('Failed to refill product stock:', error);
  process.exitCode = 1;
});
