/* Student 1 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

require('dotenv').config();

const mysql = require('mysql2/promise');

const TEST_USER_FILTER = `
  email LIKE 'customer.%@example.com'
  OR email LIKE 'brand.one.%@example.com'
  OR email LIKE 'brand.two.%@example.com'
  OR email LIKE 'admin.%@example.com'
`;

function toIdList(rows, key) {
  return rows.map((row) => row[key]).filter(Boolean);
}

async function main() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const summary = {};

  async function run(label, sql, params = []) {
    const [result] = await db.query(sql, params);
    summary[label] = result.affectedRows ?? 0;
  }

  function withInClause(column, ids) {
    if (!ids.length) return { sql: 'FALSE', params: [] };
    return {
      sql: `${column} IN (${ids.map(() => '?').join(', ')})`,
      params: ids,
    };
  }

  try {
    await db.beginTransaction();

    const [userRows] = await db.query(`SELECT user_id FROM users WHERE ${TEST_USER_FILTER}`);
    const userIds = toIdList(userRows, 'user_id');
    const userClause = withInClause('user_id', userIds);
    const brandUserClause = withInClause('brand_user_id', userIds);

    const productWhere = [
      `name_en LIKE 'Integration Test Product %'`,
      `name_es LIKE 'Integration Test Product %'`,
      userIds.length ? `brand_user_id IN (${userIds.map(() => '?').join(', ')})` : 'FALSE',
    ].join(' OR ');
    const [productRows] = await db.query(
      `SELECT product_id FROM products WHERE ${productWhere}`,
      userIds
    );
    const productIds = toIdList(productRows, 'product_id');
    const productClause = withInClause('product_id', productIds);

    const [orderRows] = userIds.length
      ? await db.query(
        `SELECT order_id FROM orders WHERE user_id IN (${userIds.map(() => '?').join(', ')})`,
        userIds
      )
      : [[]];
    const orderIds = toIdList(orderRows, 'order_id');
    const orderClause = withInClause('order_id', orderIds);

    const [cartRows] = userIds.length
      ? await db.query(
        `SELECT cart_id FROM shopping_carts WHERE user_id IN (${userIds.map(() => '?').join(', ')})`,
        userIds
      )
      : [[]];
    const cartIds = toIdList(cartRows, 'cart_id');
    const cartClause = withInClause('cart_id', cartIds);

    await run(
      'cart_items',
      `DELETE FROM cart_items
       WHERE ${cartClause.sql}
          OR ${productClause.sql}`,
      [...cartClause.params, ...productClause.params]
    );
    await run(
      'payments',
      `DELETE FROM payments
       WHERE ${orderClause.sql}`,
      orderClause.params
    );
    await run(
      'order_items',
      `DELETE FROM order_items
       WHERE ${orderClause.sql}
          OR ${productClause.sql}
          OR ${brandUserClause.sql}`,
      [...orderClause.params, ...productClause.params, ...brandUserClause.params]
    );
    await run(
      'orders',
      `DELETE FROM orders
       WHERE ${orderClause.sql}`,
      orderClause.params
    );
    await run(
      'custom_orders',
      `DELETE FROM custom_orders
       WHERE ${userClause.sql}
          OR ${brandUserClause.sql}`,
      [...userClause.params, ...brandUserClause.params]
    );
    await run(
      'service_inquiries',
      `DELETE FROM service_inquiries
       WHERE ${userClause.sql}`,
      userClause.params
    );
    await run(
      'contact_forms',
      `DELETE FROM contact_forms
       WHERE ${userClause.sql}
          OR ${brandUserClause.sql}
          OR email LIKE 'customer.%@example.com'
          OR email LIKE 'brand.one.%@example.com'
          OR email LIKE 'brand.two.%@example.com'
          OR email LIKE 'admin.%@example.com'`,
      [...userClause.params, ...brandUserClause.params]
    );
    await run(
      'addresses',
      `DELETE FROM addresses
       WHERE ${userClause.sql}`,
      userClause.params
    );
    await run(
      'shopping_carts',
      `DELETE FROM shopping_carts
       WHERE ${cartClause.sql}`,
      cartClause.params
    );
    await run(
      'products',
      `DELETE FROM products
       WHERE ${productClause.sql}`,
      productClause.params
    );
    await run(
      'users',
      `DELETE FROM users
       WHERE ${userClause.sql}`,
      userClause.params
    );

    await db.commit();
    console.log(JSON.stringify(summary, null, 2));
  } catch (error) {
    await db.rollback();
    throw error;
  } finally {
    await db.end();
  }
}

main().catch((error) => {
  console.error('Failed to clean integration test data:', error);
  process.exitCode = 1;
});
