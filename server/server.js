require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./config/db');

// App setup
const app = express();

app.use(cors({
  origin: ['https://dctdo5snio73e.cloudfront.net', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_for_lincesckf';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const DEFAULT_NOTIFICATIONS = { email: true, sms: false };
const VALID_ACCOUNT_TYPES = new Set(['CUSTOMER', 'BRAND', 'ADMIN']);
const VALID_LANGUAGES = new Set(['EN', 'ES']);
const DEFAULT_COUNTRY = 'United States';
const DEFAULT_PAYMENT_METHOD = 'CARD';



// Small helpers
function dbQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

function beginTransaction() {
  return new Promise((resolve, reject) => {
    db.beginTransaction((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function commitTransaction() {
  return new Promise((resolve, reject) => {
    db.commit((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function rollbackTransaction() {
  return new Promise((resolve, reject) => {
    db.rollback((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function makeError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function readJson(value, fallback) {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value !== 'string') return value;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function toJsonString(value, fallback) {
  if (value === undefined) return JSON.stringify(fallback);
  if (typeof value === 'string') {
    try {
      JSON.parse(value);
      return value;
    } catch {
      return JSON.stringify(fallback);
    }
  }
  return JSON.stringify(value);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item';
}

function normalizeAccountType(accountType) {
  const normalized = String(accountType ?? '').trim().toUpperCase();
  if (!normalized) return null;
  return VALID_ACCOUNT_TYPES.has(normalized) ? normalized : null;
}

function normalizePreferredLanguage(language) {
  const normalized = String(language || 'EN').trim().toUpperCase();
  return VALID_LANGUAGES.has(normalized) ? normalized : 'EN';
}

function normalizeNotifications(value) {
  const current = readJson(value, DEFAULT_NOTIFICATIONS);
  return {
    email: current.email === undefined ? DEFAULT_NOTIFICATIONS.email : Boolean(current.email),
    sms: current.sms === undefined ? DEFAULT_NOTIFICATIONS.sms : Boolean(current.sms),
  };
}

// User helpers
function buildUserName(user) {
  if ((user.account_type || user.accountType) === 'BRAND' && (user.company_name || user.companyName)) {
    return user.company_name || user.companyName;
  }

  return [
    user.first_name || user.firstName,
    user.last_name || user.lastName,
  ].filter(Boolean).join(' ') || user.email;
}

function mapAddressRow(row) {
  if (!row) return null;

  return {
    id: row.address_id,
    line1: row.street_address || '',
    line2: row.street_address_line2 || '',
    city: row.city || '',
    state: row.state_region || '',
    postalCode: row.postal_code || '',
    country: row.country || '',
    phone: row.phone || '',
    addressType: row.address_type || 'SHIPPING',
    isDefault: Boolean(row.is_default),
    recipientName: row.recipient_name || '',
  };
}

async function getUserAddresses(userId) {
  const rows = await dbQuery(
    `SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, address_id ASC`,
    [userId]
  );

  return rows.map(mapAddressRow);
}

async function getUserById(id) {
  const rows = await dbQuery(`SELECT * FROM users WHERE user_id = ?`, [id]);
  const user = rows[0];

  if (!user) return null;

  user.addresses = await getUserAddresses(user.user_id);
  return user;
}

async function getUserByEmail(email) {
  const rows = await dbQuery(`SELECT * FROM users WHERE email = ?`, [email]);
  const user = rows[0];

  if (!user) return null;

  user.addresses = await getUserAddresses(user.user_id);
  return user;
}

function buildUserResponse(user) {
  if (!user) return null;

  const notificationPreferences = normalizeNotifications(user.notification_preferences);

  return {
    id: user.user_id,
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    name: buildUserName(user),
    email: user.email,
    phone: user.phone || '',
    accountType: user.account_type || 'CUSTOMER',
    companyName: user.company_name || '',
    preferredLanguage: user.preferred_language || 'EN',
    addresses: user.addresses || [],
    notificationPreferences,
    notifications: notificationPreferences,
  };
}

function mapContactFormRow(row) {
  return {
    id: row.contact_id,
    userId: row.user_id,
    brandUserId: row.brand_user_id || null,
    brandName: row.brand_name || '',
    name: row.name || '',
    email: row.email || '',
    subject: row.subject || '',
    message: row.message || '',
    inquiryType: row.inquiry_type || 'GENERAL',
    status: row.status || 'OPEN',
    responseMessage: row.response_message || '',
    respondedAt: row.responded_at || null,
    createdAt: row.created_at || null,
  };
}

function mapCustomOrderRow(row) {
  const requirementsJson = readJson(row.requirements_json, {});

  return {
    id: row.custom_order_id,
    requestNumber: row.request_number || '',
    orderType: requirementsJson.orderType || row.service_name_en || 'custom-order',
    brandUserId: row.brand_user_id || null,
    brandName: row.brand_name || '',
    requirements: {
      quantity: Number(row.quantity || 0),
      timeline: row.timeline || requirementsJson.timeline || '',
      message: row.project_description || requirementsJson.message || '',
    },
    contactInfo: {
      name: row.contact_name || '',
      email: row.contact_email || '',
      phone: row.contact_phone || '',
      company: row.company_name || '',
    },
    status: row.request_status,
    quoteAmount: Number(row.quote_amount || 0),
    expectedDeliveryDate: row.expected_delivery_date,
    createdAt: row.created_at,
  };
}

async function ensureContactFormBrandSupport() {
  const tableRows = await dbQuery(`SHOW TABLES LIKE 'contact_forms'`);

  if (!tableRows.length) return;

  const columnRows = await dbQuery(`SHOW COLUMNS FROM contact_forms LIKE 'brand_user_id'`);

  if (!columnRows.length) {
    await dbQuery(`ALTER TABLE contact_forms ADD COLUMN brand_user_id INT NULL AFTER user_id`);
    console.log('Added brand_user_id column to contact_forms');
  }
}

async function ensureCustomOrderBrandSupport() {
  const tableRows = await dbQuery(`SHOW TABLES LIKE 'custom_orders'`);

  if (!tableRows.length) return;

  const columnRows = await dbQuery(`SHOW COLUMNS FROM custom_orders LIKE 'brand_user_id'`);

  if (!columnRows.length) {
    await dbQuery(`ALTER TABLE custom_orders ADD COLUMN brand_user_id INT NULL AFTER user_id`);
    console.log('Added brand_user_id column to custom_orders');
  }
}

const CONTACT_FORM_SELECT_SQL = `
  SELECT
    cf.*,
    COALESCE(
      NULLIF(b.company_name, ''),
      NULLIF(TRIM(CONCAT_WS(' ', b.first_name, b.last_name)), ''),
      b.email
    ) AS brand_name
  FROM contact_forms cf
  LEFT JOIN users b ON b.user_id = cf.brand_user_id
`;

const CUSTOM_ORDER_SELECT_SQL = `
  SELECT
    co.*,
    st.name_en AS service_name_en,
    st.name_es AS service_name_es,
    COALESCE(
      NULLIF(b.company_name, ''),
      NULLIF(TRIM(CONCAT_WS(' ', b.first_name, b.last_name)), ''),
      b.email
    ) AS brand_name
  FROM custom_orders co
  LEFT JOIN service_types st ON st.service_type_id = co.service_type_id
  LEFT JOIN users b ON b.user_id = co.brand_user_id
`;

function createToken(user) {
  return jwt.sign(
    {
      id: user.user_id,
      email: user.email,
      accountType: user.account_type || 'CUSTOMER',
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
}

function requireAccountTypes(...allowedTypes) {
  return (req, res, next) => {
    if (!allowedTypes.includes(req.user.accountType)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  };
}

function hasMeaningfulAddress(address) {
  if (!address || typeof address !== 'object') return false;

  return [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ].some((value) => String(value || '').trim());
}

async function syncPrimaryAddress(userId, addresses) {
  const primaryAddress = Array.isArray(addresses) ? addresses[0] : null;

  if (!hasMeaningfulAddress(primaryAddress)) {
    return getUserAddresses(userId);
  }

  const existingRows = await dbQuery(
    `SELECT * FROM addresses
     WHERE user_id = ? AND address_type = 'SHIPPING'
     ORDER BY is_default DESC, address_id ASC
     LIMIT 1`,
    [userId]
  );

  const params = [
    String(primaryAddress.line1 || '').trim(),
    String(primaryAddress.line2 || '').trim(),
    String(primaryAddress.city || '').trim(),
    String(primaryAddress.state || '').trim(),
    String(primaryAddress.postalCode || '').trim(),
    String(primaryAddress.country || DEFAULT_COUNTRY).trim() || DEFAULT_COUNTRY,
    String(primaryAddress.phone || '').trim(),
    String(primaryAddress.recipientName || '').trim(),
  ];

  if (existingRows[0]) {
    await dbQuery(
      `UPDATE addresses
       SET street_address = ?,
           street_address_line2 = ?,
           city = ?,
           state_region = ?,
           postal_code = ?,
           country = ?,
           phone = ?,
           recipient_name = ?,
           is_default = TRUE
       WHERE address_id = ?`,
      [...params, existingRows[0].address_id]
    );
  } else {
    await dbQuery(
      `INSERT INTO addresses (
        user_id,
        address_type,
        street_address,
        street_address_line2,
        city,
        state_region,
        postal_code,
        country,
        phone,
        recipient_name,
        is_default
      ) VALUES (?, 'SHIPPING', ?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [userId, ...params]
    );
  }

  await dbQuery(
    `UPDATE addresses
     SET is_default = FALSE
     WHERE user_id = ? AND address_type = 'SHIPPING' AND address_id <> (
       SELECT address_id FROM (
         SELECT address_id
         FROM addresses
         WHERE user_id = ? AND address_type = 'SHIPPING'
         ORDER BY is_default DESC, address_id ASC
         LIMIT 1
       ) AS default_address
     )`,
    [userId, userId]
  );

  return getUserAddresses(userId);
}

async function getOrCreateCategoryId(categoryName) {
  const normalized = String(categoryName || 'other').trim().toLowerCase() || 'other';
  const existingRows = await dbQuery(
    `SELECT category_id FROM categories WHERE LOWER(name_en) = ? LIMIT 1`,
    [normalized]
  );

  if (existingRows[0]) {
    return existingRows[0].category_id;
  }

  const result = await dbQuery(
    `INSERT INTO categories (name_en, name_es, description_en, description_es, is_active)
     VALUES (?, ?, ?, ?, TRUE)`,
    [
      normalized,
      normalized,
      `${normalized} category`,
      `${normalized} category`,
    ]
  );

  return result.insertId;
}

// Product helpers
const COLOR_NAME_ES = {
  white: 'Blanco',
  navy: 'Azul marino',
  burgundy: 'Borgona',
  black: 'Negro',
  rose: 'Rosa',
  silver: 'Plateado',
  blush: 'Rosa palo',
  ivory: 'Marfil',
  emerald: 'Esmeralda',
  'midnight blue': 'Azul medianoche',
  champagne: 'Champan',
  ruby: 'Rubi',
  sapphire: 'Zafiro',
  pearl: 'Perla',
  plum: 'Ciruela',
  crimson: 'Carmesi',
  gold: 'Dorado',
  charcoal: 'Carbon',
  'light blue': 'Azul claro',
  olive: 'Oliva',
  sand: 'Arena',
  rust: 'Oxido',
  cream: 'Crema',
  'geometric print': 'Estampado geometrico',
  'floral print': 'Estampado floral',
  leopard: 'Leopardo',
  'polka dot': 'Lunares',
  'solid black': 'Negro solido',
  camel: 'Camel',
  'soft grey': 'Gris suave',
  'ocean blue': 'Azul oceano',
  'sunset orange': 'Naranja atardecer',
  amethyst: 'Amatista',
  maroon: 'Granate',
  pink: 'Rosa',
  blue: 'Azul',
  red: 'Rojo',
};

function translateColorName(name) {
  const normalizedName = String(name || '').trim();
  if (!normalizedName) return '';

  return COLOR_NAME_ES[normalizedName.toLowerCase()] || normalizedName;
}

function serializeColorOption(color) {
  if (typeof color === 'string') {
    const name = color.trim();
    return name ? { name, nameEs: translateColorName(name) } : null;
  }

  if (!color || typeof color !== 'object') return null;

  const name = String(color.name || color.label || '').trim();
  if (!name) return null;

  return {
    ...color,
    name,
    nameEs: String(color.nameEs || color.labelEs || '').trim() || translateColorName(name),
  };
}

function normalizeImageList(value) {
  const images = readJson(value, Array.isArray(value) ? value : []);

  if (Array.isArray(images)) {
    return images.map((image) => String(image || '').trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value.split(',').map((image) => image.trim()).filter(Boolean);
  }

  return [];
}

function normalizeColorList(value) {
  const colors = readJson(value, Array.isArray(value) ? value : []);

  if (Array.isArray(colors)) {
    return colors
      .map((color) => {
        if (typeof color === 'string') return color.trim();
        return String(color?.name || color?.label || '').trim();
      })
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value.split(',').map((color) => color.trim()).filter(Boolean);
  }

  return [];
}

function normalizeSizes(value) {
  const rawSizes = readJson(value, Array.isArray(value) ? value : []);

  if (!Array.isArray(rawSizes)) return [];

  return rawSizes
    .map((entry) => {
      if (typeof entry === 'string') {
        return entry.trim();
      }

      if (!entry || typeof entry !== 'object') return null;

      const name = String(entry.name || entry.size || entry.label || '').trim();
      if (!name) return null;

      const stockValue = entry.stockQuantity ?? entry.stock ?? entry.quantity;
      const stockQuantity = Number(stockValue);

      if (!Number.isFinite(stockQuantity)) {
        return { name };
      }

      return {
        ...entry,
        name,
        stockQuantity: Math.max(0, Math.floor(stockQuantity)),
      };
    })
    .filter(Boolean);
}

function getSizeName(size) {
  if (typeof size === 'string') return size.trim();
  return String(size?.name || size?.size || size?.label || '').trim();
}

function getSizeStock(size) {
  if (!size || typeof size !== 'object') return null;
  const stock = Number(size.stockQuantity ?? size.stock ?? size.quantity);
  return Number.isFinite(stock) ? stock : null;
}

function getSizeStockTotal(sizes) {
  if (!Array.isArray(sizes)) return null;
  const stockedSizes = sizes.filter((size) => getSizeStock(size) !== null);

  if (stockedSizes.length === 0) return null;

  return stockedSizes.reduce((total, size) => total + getSizeStock(size), 0);
}

function normalizeProductBody(body) {
  const sizes = normalizeSizes(body.sizes);
  const colors = normalizeColorList(body.colors);
  const images = normalizeImageList(body.images);
  const sizeStockTotal = getSizeStockTotal(sizes);

  return {
    categoryName: String(body.category || 'other').trim().toLowerCase() || 'other',
    sku: String(body.sku || '').trim(),
    nameEn: String(body.name || body.nameEn || '').trim(),
    nameEs: String(body.nameEs || body.name || '').trim(),
    descriptionEn: String(body.description || body.descriptionEn || '').trim(),
    descriptionEs: String(body.descriptionEs || body.description || '').trim(),
    image: images[0] || '',
    imagesJson: toJsonString(images, []),
    price: Number(body.price),
    stockQuantity: sizeStockTotal ?? Number(body.stockQuantity || 0),
    productType: String(body.productType || 'PHYSICAL').trim().toUpperCase() || 'PHYSICAL',
    material: String(body.material || '').trim(),
    weight: body.weight === undefined || body.weight === '' ? null : Number(body.weight),
    isFeatured: body.featured ? 1 : 0,
    sizesJson: JSON.stringify(sizes),
    colorsJson: JSON.stringify(colors),
  };
}

async function ensureUniqueSku(baseSku) {
  let candidate = baseSku || `SKU-${Date.now()}`;
  let suffix = 1;

  while (true) {
    const rows = await dbQuery(`SELECT product_id FROM products WHERE sku = ? LIMIT 1`, [candidate]);
    if (rows.length === 0) return candidate;
    candidate = `${baseSku || `SKU-${Date.now()}`}-${suffix++}`;
  }
}

const PRODUCT_SELECT_SQL = `
  SELECT
    p.product_id,
    p.category_id,
    p.brand_user_id,
    p.sku,
    p.name_en,
    p.name_es,
    p.description_en,
    p.description_es,
    p.image,
    p.image_urls,
    p.price,
    p.stock_quantity,
    p.product_type,
    p.material,
    p.weight,
    p.is_featured,
    p.sizes_json,
    p.colors_json,
    c.name_en AS category_name_en,
    c.name_es AS category_name_es,
    COALESCE(
      NULLIF(u.company_name, ''),
      NULLIF(TRIM(CONCAT_WS(' ', u.first_name, u.last_name)), ''),
      u.email,
      ''
    ) AS brand_name
  FROM products p
  JOIN categories c ON c.category_id = p.category_id
  LEFT JOIN users u ON u.user_id = p.brand_user_id
`;

function serializeProduct(row) {
  const images = readJson(row.image_urls, row.image ? [row.image] : []);
  const sizes = readJson(row.sizes_json, []);
  const colors = readJson(row.colors_json, [])
    .map(serializeColorOption)
    .filter(Boolean);

  return {
    id: row.product_id,
    productId: row.product_id,
    categoryId: row.category_id,
    sku: row.sku,
    name: row.name_en,
    nameEn: row.name_en,
    nameEs: row.name_es || row.name_en,
    description: row.description_en || '',
    descriptionEn: row.description_en || '',
    descriptionEs: row.description_es || row.description_en || '',
    image: images[0] || row.image || '',
    images,
    price: Number(row.price),
    stockQuantity: Number(row.stock_quantity || 0),
    category: row.category_name_en || '',
    categoryEs: row.category_name_es || row.category_name_en || '',
    material: row.material || '',
    weight: row.weight === null || row.weight === undefined ? null : Number(row.weight),
    sizes,
    colors,
    featured: Boolean(row.is_featured),
    brandId: row.brand_user_id || null,
    brandName: row.brand_name || '',
  };
}

function normalizeDeliveryStatus(value) {
  return String(value || '').trim().toUpperCase() === 'DELIVERED' ? 'Delivered' : 'Processing';
}

function deriveOrderDisplayStatus(orderStatus, items) {
  if (Array.isArray(items) && items.length > 0) {
    const deliveredCount = items.filter(
      (item) => normalizeDeliveryStatus(item.deliveryStatus || item.status) === 'Delivered'
    ).length;

    if (deliveredCount === items.length) return 'Delivered';
    if (deliveredCount > 0) return 'Partially Delivered';
  }

  if (String(orderStatus || '').trim().toUpperCase() === 'DELIVERED') {
    return 'Delivered';
  }

  return 'Processing';
}

function deriveDbOrderStatus(items) {
  if (!Array.isArray(items) || items.length === 0) return 'PENDING';

  const deliveredCount = items.filter(
    (item) => String(item.deliveryStatus || item.delivery_status || '').trim().toUpperCase() === 'DELIVERED'
  ).length;

  if (deliveredCount === items.length) return 'DELIVERED';
  if (deliveredCount > 0) return 'SHIPPED';
  return 'CONFIRMED';
}

// Order helpers
async function enrichOrderItems(items) {
  const parsedItems = readJson(items, []);

  if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
    return [];
  }

  const productIds = [...new Set(
    parsedItems
      .map((item) => Number(item.productId || item.id))
      .filter((id) => Number.isInteger(id) && id > 0)
  )];

  let productMap = new Map();

  if (productIds.length > 0) {
    const placeholders = productIds.map(() => '?').join(', ');
    const rows = await dbQuery(
      `${PRODUCT_SELECT_SQL} WHERE p.product_id IN (${placeholders})`,
      productIds
    );
    productMap = new Map(
      rows.map((row) => {
        const product = serializeProduct(row);
        return [Number(product.id), product];
      })
    );
  }

  return parsedItems.map((item) => {
    const productId = Number(item.productId || item.id);
    const product = productMap.get(productId);
    const brandId = Number(item.brandId ?? product?.brandId);
    const itemPrice = item.price === undefined || item.price === null || item.price === ''
      ? product?.price
      : item.price;

    return {
      ...item,
      productId: Number.isInteger(productId) ? productId : null,
      brandId: Number.isInteger(brandId) && brandId > 0 ? brandId : null,
      brandName: String(item.brandName || product?.brandName || '').trim(),
      name: item.name || product?.name || '',
      nameEn: item.nameEn || product?.nameEn || item.name || '',
      nameEs: item.nameEs || product?.nameEs || item.name || '',
      image: item.image || product?.image || '',
      price: Number(itemPrice || 0),
      quantity: Number(item.quantity || 0),
      selectedColor: String(item.selectedColor || item.selected_color || '').trim(),
      selectedColorEs:
        String(item.selectedColorEs || item.selected_color_es || '').trim() ||
        translateColorName(item.selectedColor || item.selected_color || ''),
      deliveryStatus: normalizeDeliveryStatus(item.deliveryStatus || item.delivery_status),
      deliveredAt: item.deliveredAt || item.delivered_at || null,
    };
  });
}

function getOrderQuantitiesByProduct(items) {
  return items.reduce((orders, item) => {
    const productId = Number(item.productId || item.id);
    const quantity = Number(item.quantity);
    const selectedSize = String(item.selectedSize || item.size || '').trim();

    if (!Number.isInteger(productId) || productId <= 0) {
      throw makeError(400, 'Each order item must include a valid product id');
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw makeError(400, 'Each order item must include a valid quantity');
    }

    if (!selectedSize) {
      throw makeError(400, 'Each order item must include a selected size');
    }

    const order = orders.get(productId) || { total: 0, sizes: new Map() };
    order.total += quantity;
    order.sizes.set(selectedSize, (order.sizes.get(selectedSize) || 0) + quantity);
    orders.set(productId, order);

    return orders;
  }, new Map());
}

async function decrementProductStock(orderQuantities) {
  const stockUpdates = [];

  for (const [productId, order] of orderQuantities.entries()) {
    const rows = await dbQuery(
      `SELECT product_id, name_en, sizes_json, stock_quantity FROM products WHERE product_id = ? FOR UPDATE`,
      [productId]
    );
    const product = rows[0];

    if (!product) {
      throw makeError(404, `Product ${productId} was not found`);
    }

    const currentStock = Number(product.stock_quantity || 0);
    const sizes = normalizeSizes(product.sizes_json);
    const hasSizeStock = sizes.some((size) => getSizeStock(size) !== null);

    if (hasSizeStock) {
      const updatedSizes = sizes.map((size) => (
        typeof size === 'string' ? { name: size } : { ...size, name: getSizeName(size) }
      ));

      for (const [selectedSize, quantity] of order.sizes.entries()) {
        const sizeIndex = updatedSizes.findIndex(
          (size) => getSizeName(size).toLowerCase() === selectedSize.toLowerCase()
        );

        if (sizeIndex === -1) {
          throw makeError(400, `${product.name_en} does not have size ${selectedSize}`);
        }

        const availableStock = getSizeStock(updatedSizes[sizeIndex]) ?? 0;
        if (availableStock < quantity) {
          throw makeError(
            409,
            `${product.name_en} size ${selectedSize} has only ${availableStock} item(s) left in stock`
          );
        }

        updatedSizes[sizeIndex] = {
          ...updatedSizes[sizeIndex],
          stockQuantity: availableStock - quantity,
        };

        stockUpdates.push({
          productId,
          name: product.name_en,
          size: selectedSize,
          quantityOrdered: quantity,
          stockRemaining: availableStock - quantity,
        });
      }

      const nextTotalStock = getSizeStockTotal(updatedSizes) ?? 0;
      await dbQuery(
        `UPDATE products SET stock_quantity = ?, sizes_json = ? WHERE product_id = ?`,
        [nextTotalStock, JSON.stringify(updatedSizes), productId]
      );
      continue;
    }

    if (currentStock < order.total) {
      throw makeError(
        409,
        `${product.name_en} has only ${currentStock} item(s) left in stock`
      );
    }

    await dbQuery(
      `UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id = ?`,
      [order.total, productId]
    );

    for (const [selectedSize, quantity] of order.sizes.entries()) {
      stockUpdates.push({
        productId,
        name: product.name_en,
        size: selectedSize,
        quantityOrdered: quantity,
        stockRemaining: currentStock - order.total,
      });
    }
  }

  return stockUpdates;
}

async function getOrCreateServiceType(orderType) {
  const normalized = String(orderType || 'other').trim().toLowerCase() || 'other';
  const rows = await dbQuery(
    `SELECT service_type_id FROM service_types WHERE LOWER(name_en) = ? LIMIT 1`,
    [normalized]
  );

  if (rows[0]) {
    return rows[0].service_type_id;
  }

  const result = await dbQuery(
    `INSERT INTO service_types (name_en, name_es, description_en, description_es, is_active)
     VALUES (?, ?, ?, ?, TRUE)`,
    [
      normalized,
      normalized,
      `${normalized} service`,
      `${normalized} service`,
    ]
  );

  return result.insertId;
}

// Custom order and contact helpers
function mapSubjectToInquiryType(subject) {
  const normalized = String(subject || '').trim().toLowerCase();

  if (normalized === 'custom-order' || normalized === 'product-inquiry') return 'ORDER';
  if (normalized === 'b2b-partnership') return 'SERVICE';
  if (normalized === 'support') return 'GENERAL';
  return 'OTHER';
}

function generateOrderNumber() {
  return `INV-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;
}

function generateRequestNumber() {
  return `REQ-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;
}

async function getOrderAddress(addressId) {
  if (!addressId) {
    return {};
  }

  const rows = await dbQuery(`SELECT * FROM addresses WHERE address_id = ?`, [addressId]);
  const address = rows[0];

  if (!address) {
    return {};
  }

  return {
    fullName: address.recipient_name || '',
    address: [address.street_address, address.street_address_line2].filter(Boolean).join(', '),
    line1: address.street_address || '',
    line2: address.street_address_line2 || '',
    city: address.city || '',
    state: address.state_region || '',
    zipCode: address.postal_code || '',
    country: address.country || '',
    phone: address.phone || '',
  };
}

async function getOrderItems(orderId, brandUserId = null) {
  const params = [orderId];
  const brandFilter = brandUserId ? ' AND oi.brand_user_id = ?' : '';

  if (brandUserId) {
    params.push(brandUserId);
  }

  const rows = await dbQuery(
    `SELECT
      oi.*,
      COALESCE(
        NULLIF(oi.brand_name_snapshot, ''),
        NULLIF(u.company_name, ''),
        NULLIF(TRIM(CONCAT_WS(' ', u.first_name, u.last_name)), ''),
        u.email,
        ''
      ) AS resolved_brand_name,
      COALESCE(oi.product_name_en, p.name_en) AS resolved_name_en,
      COALESCE(oi.product_name_es, p.name_es, p.name_en) AS resolved_name_es,
      COALESCE(oi.product_image, p.image) AS resolved_image
     FROM order_items oi
     LEFT JOIN products p ON p.product_id = oi.product_id
     LEFT JOIN users u ON u.user_id = COALESCE(oi.brand_user_id, p.brand_user_id)
     WHERE oi.order_id = ?${brandFilter}
     ORDER BY oi.order_item_id ASC`,
    params
  );

  return rows.map((row) => ({
    itemIndex: row.order_item_id,
    id: row.product_id,
    productId: row.product_id,
    brandId: row.brand_user_id || null,
    brandName: row.resolved_brand_name || '',
    name: row.resolved_name_en || '',
    nameEn: row.resolved_name_en || '',
    nameEs: row.resolved_name_es || row.resolved_name_en || '',
    image: row.resolved_image || '',
    price: Number(row.unit_price || 0),
    quantity: Number(row.quantity || 0),
    selectedColor: row.selected_color || '',
    selectedColorEs: translateColorName(row.selected_color || ''),
    selectedSize: row.selected_size || '',
    deliveryStatus: normalizeDeliveryStatus(row.delivery_status),
    deliveredAt: row.delivered_at || null,
  }));
}

async function buildOrderResponse(order, brandUserId = null) {
  const items = await getOrderItems(order.order_id, brandUserId);
  const shippingAddress = await getOrderAddress(order.shipping_address_id);
  const totalAmount = brandUserId
    ? items.reduce((total, item) => total + Number(item.price || 0) * Number(item.quantity || 0), 0)
    : Number(order.total_amount || 0);

  return {
    id: order.order_id,
    orderNumber: order.order_number,
    userId: order.user_id,
    totalAmount,
    status: deriveOrderDisplayStatus(order.order_status, items),
    paymentStatus: order.payment_status,
    paymentMethod: order.payment_method,
    createdAt: order.order_date,
    shippingAddress,
    items,
  };
}

// Public routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  const {
    firstName = '',
    lastName = '',
    email = '',
    password = '',
    phone = '',
    accountType,
    companyName = '',
    preferredLanguage = 'EN',
  } = req.body;

  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedAccountType = normalizeAccountType(accountType);
  const normalizedLanguage = normalizePreferredLanguage(preferredLanguage);

  if (!isValidEmail(normalizedEmail)) {
    return res.status(400).json({ error: 'A valid email is required' });
  }

  if (String(password).length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  if (!normalizedAccountType || normalizedAccountType === 'ADMIN') {
    return res.status(400).json({ error: 'Account type must be CUSTOMER or BRAND' });
  }

  if (normalizedAccountType === 'CUSTOMER' && (!firstName.trim() || !lastName.trim())) {
    return res.status(400).json({ error: 'First name and last name are required' });
  }

  if (normalizedAccountType === 'BRAND' && !companyName.trim()) {
    return res.status(400).json({ error: 'Company name is required for brand accounts' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await dbQuery(
      `INSERT INTO users (
        email,
        password_hash,
        account_type,
        first_name,
        last_name,
        company_name,
        phone,
        preferred_language,
        is_active,
        notification_preferences
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE, ?)`,
      [
        normalizedEmail,
        passwordHash,
        normalizedAccountType,
        firstName.trim(),
        lastName.trim(),
        companyName.trim(),
        String(phone).trim(),
        normalizedLanguage,
        JSON.stringify(DEFAULT_NOTIFICATIONS),
      ]
    );

    const createdUser = await getUserById(result.insertId);

    res.status(201).json({
      message: 'User registered successfully',
      userId: createdUser.user_id,
      token: createToken(createdUser),
      user: buildUserResponse(createdUser),
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }

    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const requestBody = req.body && typeof req.body === 'object' ? req.body : {};
  const email = requestBody.email ?? '';
  const password = requestBody.password ?? '';
  const hasRequestedAccountType =
    Object.prototype.hasOwnProperty.call(requestBody, 'accountType') ||
    Object.prototype.hasOwnProperty.call(requestBody, 'account_type');
  const requestedAccountType = hasRequestedAccountType
    ? requestBody.accountType ?? requestBody.account_type
    : undefined;
  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedAccountType = normalizeAccountType(requestedAccountType);

  if (!isValidEmail(normalizedEmail) || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (hasRequestedAccountType && normalizedAccountType === null) {
    return res.status(400).json({ error: 'Account type must be CUSTOMER or BRAND' });
  }

  try {
    const user = await getUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    if (!user.is_active) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const currentUserAccountType = normalizeAccountType(user.account_type || user.accountType);

    if (normalizedAccountType && currentUserAccountType !== normalizedAccountType) {
      return res.status(401).json({ error: 'Selected account type does not match this account' });
    }

    res.json({
      message: 'Login successful',
      token: createToken(user),
      user: buildUserResponse(user),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use('/api', authMiddleware);

// User routes
app.get('/api/auth/session', async (req, res) => {
  try {
    const user = await getUserById(req.user.id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ user: buildUserResponse(user) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

app.get('/api/brands', async (req, res) => {
  try {
    const rows = await dbQuery(
      `SELECT user_id, email, first_name, last_name, company_name, account_type
       FROM users
       WHERE account_type = 'BRAND' AND is_active = TRUE
       ORDER BY COALESCE(NULLIF(company_name, ''), email) ASC`
    );

    res.json(rows.map((brand) => ({
      id: brand.user_id,
      name: buildUserName(brand),
      email: brand.email,
      companyName: brand.company_name || '',
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/profile', async (req, res) => {
  try {
    const user = await getUserById(req.user.id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(buildUserResponse(user));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/profile', async (req, res) => {
  try {
    const currentUser = await getUserById(req.user.id);

    if (!currentUser) return res.status(404).json({ error: 'User not found' });

    const nextEmail = req.body.email === undefined
      ? currentUser.email
      : String(req.body.email).trim().toLowerCase();

    if (!isValidEmail(nextEmail)) {
      return res.status(400).json({ error: 'A valid email is required' });
    }

    const nextPreferredLanguage = req.body.preferredLanguage === undefined
      ? currentUser.preferred_language
      : normalizePreferredLanguage(req.body.preferredLanguage);

    await dbQuery(
      `UPDATE users
       SET first_name = ?,
           last_name = ?,
           email = ?,
           phone = ?,
           company_name = ?,
           preferred_language = ?
       WHERE user_id = ?`,
      [
        req.body.firstName === undefined ? currentUser.first_name : String(req.body.firstName).trim(),
        req.body.lastName === undefined ? currentUser.last_name : String(req.body.lastName).trim(),
        nextEmail,
        req.body.phone === undefined ? currentUser.phone : String(req.body.phone).trim(),
        req.body.companyName === undefined ? currentUser.company_name : String(req.body.companyName).trim(),
        nextPreferredLanguage,
        req.user.id,
      ]
    );

    await syncPrimaryAddress(req.user.id, req.body.addresses);

    const updatedUser = await getUserById(req.user.id);
    res.json({ message: 'Profile updated successfully', user: buildUserResponse(updatedUser) });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }

    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/password', async (req, res) => {
  const { currentPassword = '', newPassword = '' } = req.body;

  if (!currentPassword || String(newPassword).length < 6) {
    return res.status(400).json({
      error: 'Current password is required and new password must be at least 6 characters',
    });
  }

  try {
    const user = await getUserById(req.user.id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await dbQuery(`UPDATE users SET password_hash = ? WHERE user_id = ?`, [passwordHash, req.user.id]);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/notifications', async (req, res) => {
  try {
    const user = await getUserById(req.user.id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const incoming = req.body.notifications || req.body.notificationPreferences || req.body;
    const currentPreferences = normalizeNotifications(user.notification_preferences);
    const notificationPreferences = {
      ...currentPreferences,
      email: incoming.email === undefined ? currentPreferences.email : Boolean(incoming.email),
      sms: incoming.sms === undefined ? currentPreferences.sms : Boolean(incoming.sms),
    };

    await dbQuery(
      `UPDATE users SET notification_preferences = ? WHERE user_id = ?`,
      [JSON.stringify(notificationPreferences), req.user.id]
    );

    const updatedUser = await getUserById(req.user.id);
    res.json({
      message: 'Notification preferences updated successfully',
      user: buildUserResponse(updatedUser),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Product routes
app.get('/api/products', async (req, res) => {
  try {
    const { category } = req.query;
    const normalizedCategory = String(category || '').trim().toLowerCase();
    const rows = normalizedCategory && normalizedCategory !== 'all'
      ? await dbQuery(`${PRODUCT_SELECT_SQL} WHERE LOWER(c.name_en) = ? ORDER BY p.product_id ASC`, [normalizedCategory])
      : await dbQuery(`${PRODUCT_SELECT_SQL} ORDER BY p.product_id ASC`);

    res.json(rows.map(serializeProduct));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/brand/my-products', requireAccountTypes('BRAND', 'ADMIN'), async (req, res) => {
  try {
    const rows = req.user.accountType === 'ADMIN'
      ? await dbQuery(`${PRODUCT_SELECT_SQL} ORDER BY p.product_id DESC`)
      : await dbQuery(`${PRODUCT_SELECT_SQL} WHERE p.brand_user_id = ? ORDER BY p.product_id DESC`, [req.user.id]);

    res.json(rows.map(serializeProduct));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/featured', async (req, res) => {
  const requestedLimit = Number(req.query.limit);
  const limit = Number.isInteger(requestedLimit) && requestedLimit > 0
    ? Math.min(requestedLimit, 12)
    : 4;

  try {
    const rows = await dbQuery(
      `${PRODUCT_SELECT_SQL} WHERE p.is_featured = 1 ORDER BY p.product_id ASC LIMIT ?`,
      [limit]
    );

    res.json(rows.map(serializeProduct));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const rows = await dbQuery(`${PRODUCT_SELECT_SQL} WHERE p.product_id = ?`, [req.params.id]);
    const product = rows[0];

    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.json(serializeProduct(product));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', requireAccountTypes('BRAND', 'ADMIN'), async (req, res) => {
  const product = normalizeProductBody(req.body);

  if (!product.nameEn || !Number.isFinite(product.price) || product.price < 0) {
    return res.status(400).json({ error: 'Product name and valid price are required' });
  }

  try {
    let brandUserId = req.user.id;

    if (req.user.accountType === 'ADMIN' && req.body.brandId !== undefined) {
      const requestedBrandId = Number(req.body.brandId);

      if (!Number.isInteger(requestedBrandId) || requestedBrandId <= 0) {
        return res.status(400).json({ error: 'A valid brand id is required' });
      }

      const brandRows = await dbQuery(
        `SELECT user_id FROM users WHERE user_id = ? AND account_type = 'BRAND'`,
        [requestedBrandId]
      );

      if (brandRows.length === 0) {
        return res.status(400).json({ error: 'Selected brand does not exist' });
      }

      brandUserId = requestedBrandId;
    }

    const categoryId = await getOrCreateCategoryId(product.categoryName);
    const skuBase = product.sku || `${slugify(product.categoryName).slice(0, 4).toUpperCase()}-${slugify(product.nameEn).slice(0, 8).toUpperCase()}`;
    const sku = await ensureUniqueSku(skuBase);

    const result = await dbQuery(
      `INSERT INTO products (
        category_id,
        brand_user_id,
        sku,
        name_en,
        name_es,
        description_en,
        description_es,
        image,
        image_urls,
        price,
        stock_quantity,
        product_type,
        material,
        weight,
        is_featured,
        sizes_json,
        colors_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        categoryId,
        brandUserId,
        sku,
        product.nameEn,
        product.nameEs,
        product.descriptionEn,
        product.descriptionEs,
        product.image,
        product.imagesJson,
        product.price,
        product.stockQuantity,
        product.productType,
        product.material,
        product.weight,
        product.isFeatured,
        product.sizesJson,
        product.colorsJson,
      ]
    );

    const rows = await dbQuery(`${PRODUCT_SELECT_SQL} WHERE p.product_id = ?`, [result.insertId]);
    res.status(201).json({
      message: 'Product created',
      product: serializeProduct(rows[0]),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Order routes
app.post('/api/orders', async (req, res) => {
  const { items, totalAmount, shippingAddress } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must include at least one item' });
  }

  if (!Number.isFinite(Number(totalAmount)) || Number(totalAmount) < 0) {
    return res.status(400).json({ error: 'A valid total amount is required' });
  }

  let transactionStarted = false;

  try {
    const orderItems = await enrichOrderItems(items);
    const orderQuantities = getOrderQuantitiesByProduct(orderItems);
    const computedTotalAmount = orderItems.reduce(
      (total, item) => total + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );

    if (Number(totalAmount) > 0 && Math.abs(Number(totalAmount) - computedTotalAmount) > 0.01) {
      return res.status(400).json({ error: 'Order total does not match current product pricing' });
    }

    await beginTransaction();
    transactionStarted = true;

    const stockUpdates = await decrementProductStock(orderQuantities);

    const shippingResult = await dbQuery(
      `INSERT INTO addresses (
        user_id,
        address_type,
        street_address,
        street_address_line2,
        city,
        state_region,
        postal_code,
        country,
        phone,
        recipient_name,
        is_default
      ) VALUES (?, 'SHIPPING', ?, ?, ?, ?, ?, ?, ?, ?, FALSE)`,
      [
        req.user.id,
        String(shippingAddress?.address || '').trim(),
        '',
        String(shippingAddress?.city || '').trim(),
        '',
        String(shippingAddress?.zipCode || '').trim(),
        String(shippingAddress?.country || DEFAULT_COUNTRY).trim() || DEFAULT_COUNTRY,
        String(shippingAddress?.phone || '').trim(),
        String(shippingAddress?.fullName || '').trim(),
      ]
    );

    const orderNumber = generateOrderNumber();
    const orderResult = await dbQuery(
      `INSERT INTO orders (
        user_id,
        order_number,
        total_amount,
        order_status,
        payment_method,
        payment_status,
        shipping_address_id,
        billing_address_id
      ) VALUES (?, ?, ?, 'CONFIRMED', ?, 'PAID', ?, NULL)`,
      [
        req.user.id,
        orderNumber,
        computedTotalAmount,
        DEFAULT_PAYMENT_METHOD,
        shippingResult.insertId,
      ]
    );

    for (const item of orderItems) {
      await dbQuery(
        `INSERT INTO order_items (
          order_id,
          product_id,
          brand_user_id,
          product_name_en,
          product_name_es,
          product_image,
          brand_name_snapshot,
          quantity,
          unit_price,
          selected_size,
          selected_color,
          delivery_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PROCESSING')`,
        [
          orderResult.insertId,
          item.productId,
          item.brandId,
          item.nameEn || item.name || '',
          item.nameEs || item.nameEn || item.name || '',
          item.image || '',
          item.brandName || '',
          Number(item.quantity),
          Number(item.price),
          String(item.selectedSize || '').trim(),
          String(item.selectedColor || '').trim(),
        ]
      );
    }

    await dbQuery(
      `INSERT INTO payments (order_id, payment_method, amount, payment_status, paid_at)
       VALUES (?, ?, ?, 'PAID', CURRENT_TIMESTAMP)`,
      [orderResult.insertId, DEFAULT_PAYMENT_METHOD, computedTotalAmount]
    );

    await commitTransaction();
    transactionStarted = false;

    res.status(201).json({
      message: 'Order created successfully',
      orderId: orderResult.insertId,
      orderNumber,
      inventoryUpdated: true,
      stockUpdates,
    });
  } catch (error) {
    if (transactionStarted) {
      try {
        await rollbackTransaction();
      } catch (rollbackError) {
        console.error('Failed to roll back order transaction:', rollbackError);
      }
    }

    res.status(error.status || 500).json({ error: error.message });
  }
});

app.get('/api/orders/my-orders', async (req, res) => {
  try {
    const rows = await dbQuery(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC`,
      [req.user.id]
    );

    const orders = await Promise.all(rows.map((order) => buildOrderResponse(order)));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders/brand/my-orders', requireAccountTypes('BRAND', 'ADMIN'), async (req, res) => {
  try {
    const rows = req.user.accountType === 'ADMIN'
      ? await dbQuery(`SELECT * FROM orders ORDER BY order_date DESC`)
      : await dbQuery(
          `SELECT DISTINCT o.*
           FROM orders o
           JOIN order_items oi ON oi.order_id = o.order_id
           WHERE oi.brand_user_id = ?
           ORDER BY o.order_date DESC`,
          [req.user.id]
        );

    const orders = await Promise.all(
      rows.map((order) => buildOrderResponse(order, req.user.accountType === 'ADMIN' ? null : req.user.id))
    );

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put(
  '/api/orders/:orderId/items/:itemIndex/deliver',
  requireAccountTypes('BRAND', 'ADMIN'),
  async (req, res) => {
    const orderId = Number(req.params.orderId);
    const orderItemId = Number(req.params.itemIndex);

    if (!Number.isInteger(orderId) || orderId <= 0 || !Number.isInteger(orderItemId) || orderItemId <= 0) {
      return res.status(400).json({ error: 'A valid order id and item index are required' });
    }

    try {
      const itemRows = await dbQuery(
        `SELECT * FROM order_items WHERE order_item_id = ? AND order_id = ? LIMIT 1`,
        [orderItemId, orderId]
      );
      const orderItem = itemRows[0];

      if (!orderItem) {
        return res.status(404).json({ error: 'Order item not found' });
      }

      if (
        req.user.accountType !== 'ADMIN' &&
        Number(orderItem.brand_user_id) !== Number(req.user.id)
      ) {
        return res.status(403).json({ error: 'You can only update delivery for your own products' });
      }

      await dbQuery(
        `UPDATE order_items
         SET delivery_status = 'DELIVERED',
             delivered_at = CURRENT_TIMESTAMP
         WHERE order_item_id = ?`,
        [orderItemId]
      );

      const orderRows = await dbQuery(`SELECT * FROM orders WHERE order_id = ? LIMIT 1`, [orderId]);
      const order = orderRows[0];

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const allItems = await getOrderItems(orderId);
      const nextOrderStatus = deriveDbOrderStatus(
        allItems.map((item) => ({ deliveryStatus: item.deliveryStatus }))
      );

      await dbQuery(
        `UPDATE orders SET order_status = ? WHERE order_id = ?`,
        [nextOrderStatus, orderId]
      );

      const refreshedOrderRows = await dbQuery(`SELECT * FROM orders WHERE order_id = ? LIMIT 1`, [orderId]);
      const refreshedOrder = await buildOrderResponse(
        refreshedOrderRows[0],
        req.user.accountType === 'ADMIN' ? null : req.user.id
      );

      res.json({
        message: 'Delivery status updated successfully',
        order: refreshedOrder,
      });
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }
);

// Custom order routes
app.post('/api/custom-orders', async (req, res) => {
  const { orderType, requirements = {}, contactInfo = {}, brandId } = req.body;

  if (!orderType) {
    return res.status(400).json({ error: 'Order type is required' });
  }

  const quantity = Number(requirements.quantity || 0);
  const normalizedContactEmail = String(contactInfo.email || '').trim().toLowerCase();
  const phoneDigits = String(contactInfo.phone || '').replace(/\D/g, '');

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({ error: 'A valid quantity is required' });
  }

  if (!isValidEmail(normalizedContactEmail)) {
    return res.status(400).json({ error: 'A valid contact email is required' });
  }

  if (phoneDigits.length !== 10) {
    return res.status(400).json({ error: 'Contact phone number must be 10 digits' });
  }

  try {
    let normalizedBrandId = null;

    if (brandId !== undefined && brandId !== null && String(brandId).trim() !== '') {
      normalizedBrandId = Number.parseInt(brandId, 10);

      if (!Number.isInteger(normalizedBrandId) || normalizedBrandId <= 0) {
        return res.status(400).json({ error: 'A valid brand is required' });
      }

      const brandRows = await dbQuery(
        `SELECT user_id
         FROM users
         WHERE user_id = ? AND account_type = 'BRAND' AND is_active = TRUE
         LIMIT 1`,
        [normalizedBrandId]
      );

      if (!brandRows.length) {
        return res.status(400).json({ error: 'Selected brand does not exist' });
      }
    }

    const serviceTypeId = await getOrCreateServiceType(orderType);
    const requestNumber = generateRequestNumber();

    const result = await dbQuery(
      `INSERT INTO custom_orders (
        user_id,
        brand_user_id,
        service_type_id,
        request_number,
        company_name,
        project_description,
        quantity,
        request_status,
        quote_amount,
        expected_delivery_date,
        internal_notes,
        timeline,
        contact_name,
        contact_email,
        contact_phone,
        requirements_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'NEW', 0.00, NULL, NULL, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        normalizedBrandId,
        serviceTypeId,
        requestNumber,
        String(contactInfo.company || '').trim(),
        String(requirements.message || '').trim(),
        quantity,
        String(requirements.timeline || '').trim(),
        String(contactInfo.name || '').trim(),
        normalizedContactEmail,
        phoneDigits,
        JSON.stringify({
          orderType,
          brandId: normalizedBrandId,
          timeline: String(requirements.timeline || '').trim(),
          message: String(requirements.message || '').trim(),
        }),
      ]
    );

    res.status(201).json({
      message: 'Custom order request submitted successfully',
      orderId: result.insertId,
      requestNumber,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/custom-orders/brand-requests', requireAccountTypes('BRAND', 'ADMIN'), async (req, res) => {
  try {
    const rows = req.user.accountType === 'ADMIN'
      ? await dbQuery(`${CUSTOM_ORDER_SELECT_SQL} ORDER BY co.created_at DESC`)
      : await dbQuery(
          `${CUSTOM_ORDER_SELECT_SQL} WHERE co.brand_user_id = ? ORDER BY co.created_at DESC`,
          [req.user.id]
        );

    res.json(rows.map(mapCustomOrderRow));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/custom-orders/my-requests', async (req, res) => {
  try {
    const rows = await dbQuery(
      `${CUSTOM_ORDER_SELECT_SQL}
       WHERE co.user_id = ?
       ORDER BY co.created_at DESC`,
      [req.user.id]
    );

    res.json(rows.map(mapCustomOrderRow));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Contact routes
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message, brandId } = req.body;

  if (!name || !isValidEmail(email) || !message) {
    return res.status(400).json({ error: 'Name, valid email, and message are required' });
  }

  try {
    let normalizedBrandId = null;

    if (brandId !== undefined && brandId !== null && String(brandId).trim() !== '') {
      normalizedBrandId = Number.parseInt(brandId, 10);

      if (!Number.isInteger(normalizedBrandId) || normalizedBrandId <= 0) {
        return res.status(400).json({ error: 'A valid brand is required' });
      }

      const brandRows = await dbQuery(
        `SELECT user_id
         FROM users
         WHERE user_id = ? AND account_type = 'BRAND' AND is_active = TRUE
         LIMIT 1`,
        [normalizedBrandId]
      );

      if (!brandRows.length) {
        return res.status(400).json({ error: 'Selected brand does not exist' });
      }
    }

    const result = await dbQuery(
      `INSERT INTO contact_forms (
        user_id,
        brand_user_id,
        name,
        email,
        subject,
        message,
        inquiry_type,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'OPEN')`,
      [
        req.user.id || null,
        normalizedBrandId,
        String(name).trim(),
        String(email).trim().toLowerCase(),
        String(subject || '').trim(),
        String(message).trim(),
        mapSubjectToInquiryType(subject),
      ]
    );

    res.status(201).json({
      message: 'Contact message received',
      id: result.insertId,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/contact/brand-inquiries', requireAccountTypes('BRAND', 'ADMIN'), async (req, res) => {
  try {
    const rows = req.user.accountType === 'ADMIN'
      ? await dbQuery(`${CONTACT_FORM_SELECT_SQL} ORDER BY cf.contact_id DESC`)
      : await dbQuery(
          `${CONTACT_FORM_SELECT_SQL} WHERE cf.brand_user_id = ? ORDER BY cf.contact_id DESC`,
          [req.user.id]
        );

    res.json(rows.map(mapContactFormRow));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/contact', requireAccountTypes('ADMIN'), async (req, res) => {
  try {
    const rows = await dbQuery(`${CONTACT_FORM_SELECT_SQL} ORDER BY cf.contact_id DESC`);
    res.json(rows.map(mapContactFormRow));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001;

async function initializeServer() {
  await ensureContactFormBrandSupport();
  await ensureCustomOrderBrandSupport();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

initializeServer().catch((error) => {
  console.error('Failed to initialize server:', error);
  process.exit(1);
});
