const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_for_lincesckf';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const VALID_ACCOUNT_TYPES = new Set(['CUSTOMER', 'BRAND', 'ADMIN']);
const DEFAULT_NOTIFICATIONS = { email: true, sms: false };

function dbQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

function parseJson(value, fallback) {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value !== 'string') return value;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function toJsonText(value, fallback) {
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

function normalizeAccountType(accountType) {
  const normalized = String(accountType || 'CUSTOMER').trim().toUpperCase();
  return VALID_ACCOUNT_TYPES.has(normalized) ? normalized : null;
}

function buildUserName(user) {
  if (user.accountType === 'BRAND' && user.companyName) return user.companyName;
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;
}

function publicUser(user) {
  if (!user) return null;

  const notificationPreferences = parseJson(
    user.notificationPreferences,
    DEFAULT_NOTIFICATIONS
  );

  return {
    id: user.id,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    name: buildUserName(user),
    email: user.email,
    phone: user.phone || '',
    accountType: user.accountType || 'CUSTOMER',
    companyName: user.companyName || '',
    addresses: parseJson(user.addresses, []),
    notificationPreferences,
    notifications: notificationPreferences,
  };
}

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      accountType: user.accountType || 'CUSTOMER',
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

async function getUserById(id) {
  const rows = await dbQuery(`SELECT * FROM Users WHERE id = ?`, [id]);
  return rows[0] || null;
}

function serializeProduct(row) {
  const images = parseJson(row.images, []);

  return {
    ...row,
    price: Number(row.price),
    stockQuantity: Number(row.stockQuantity || 0),
    image: images[0] || '',
    nameEn: row.name,
    nameEs: row.name,
    descriptionEn: row.description,
    descriptionEs: row.description,
  };
}

function normalizeProductBody(body) {
  return {
    name: String(body.name || '').trim(),
    description: String(body.description || '').trim(),
    price: Number(body.price),
    category: String(body.category || '').trim(),
    material: String(body.material || '').trim(),
    images: toJsonText(body.images, []),
    stockQuantity: Number(body.stockQuantity || 0),
    sizes: toJsonText(body.sizes, []),
    colors: toJsonText(body.colors, []),
  };
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ==========================================
// Authentication & User Management
// ==========================================
app.post('/api/auth/register', async (req, res) => {
  const {
    firstName = '',
    lastName = '',
    email = '',
    password = '',
    phone = '',
    accountType,
    companyName = '',
  } = req.body;

  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedAccountType = normalizeAccountType(accountType);

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
      `INSERT INTO Users (
        firstName,
        lastName,
        email,
        passwordHash,
        phone,
        accountType,
        companyName,
        addresses,
        notificationPreferences
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firstName.trim(),
        lastName.trim(),
        normalizedEmail,
        passwordHash,
        String(phone).trim(),
        normalizedAccountType,
        companyName.trim(),
        JSON.stringify([]),
        JSON.stringify(DEFAULT_NOTIFICATIONS),
      ]
    );

    const createdUser = await getUserById(result.insertId);
    const token = createToken(createdUser);

    res.status(201).json({
      message: 'User registered successfully',
      userId: createdUser.id,
      token,
      user: publicUser(createdUser),
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email = '', password = '' } = req.body;
  const normalizedEmail = String(email).trim().toLowerCase();

  if (!isValidEmail(normalizedEmail) || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const rows = await dbQuery(`SELECT * FROM Users WHERE email = ?`, [normalizedEmail]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      token: createToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Everything below this line requires a valid JWT.
app.use('/api', authMiddleware);

app.get('/api/auth/session', async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

app.get('/api/users/profile', async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(publicUser(user));
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

    const nextAddresses = req.body.addresses === undefined
      ? currentUser.addresses
      : JSON.stringify(req.body.addresses);

    await dbQuery(
      `UPDATE Users
       SET firstName = ?,
           lastName = ?,
           email = ?,
           phone = ?,
           companyName = ?,
           addresses = ?
       WHERE id = ?`,
      [
        req.body.firstName === undefined ? currentUser.firstName : String(req.body.firstName).trim(),
        req.body.lastName === undefined ? currentUser.lastName : String(req.body.lastName).trim(),
        nextEmail,
        req.body.phone === undefined ? currentUser.phone : String(req.body.phone).trim(),
        req.body.companyName === undefined ? currentUser.companyName : String(req.body.companyName).trim(),
        nextAddresses,
        req.user.id,
      ]
    );

    const updatedUser = await getUserById(req.user.id);
    res.json({ message: 'Profile updated successfully', user: publicUser(updatedUser) });
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

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await dbQuery(`UPDATE Users SET passwordHash = ? WHERE id = ?`, [passwordHash, req.user.id]);

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
    const currentPreferences = parseJson(user.notificationPreferences, DEFAULT_NOTIFICATIONS);
    const notificationPreferences = {
      ...currentPreferences,
      email: incoming.email === undefined ? currentPreferences.email : Boolean(incoming.email),
      sms: incoming.sms === undefined ? currentPreferences.sms : Boolean(incoming.sms),
    };

    await dbQuery(
      `UPDATE Users SET notificationPreferences = ? WHERE id = ?`,
      [JSON.stringify(notificationPreferences), req.user.id]
    );

    const updatedUser = await getUserById(req.user.id);
    res.json({
      message: 'Notification preferences updated successfully',
      user: publicUser(updatedUser),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// Product Catalog
// ==========================================
app.get('/api/products', async (req, res) => {
  try {
    const { category } = req.query;
    const rows = category && category !== 'all'
      ? await dbQuery(`SELECT * FROM Products WHERE category = ? ORDER BY id ASC`, [category])
      : await dbQuery(`SELECT * FROM Products ORDER BY id ASC`);

    res.json(rows.map(serializeProduct));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/brand/my-products', requireAccountTypes('BRAND', 'ADMIN'), async (req, res) => {
  try {
    const rows = req.user.accountType === 'ADMIN'
      ? await dbQuery(`SELECT * FROM Products ORDER BY id DESC`)
      : await dbQuery(`SELECT * FROM Products WHERE brandId = ? ORDER BY id DESC`, [req.user.id]);

    res.json(rows.map(serializeProduct));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const rows = await dbQuery(`SELECT * FROM Products WHERE id = ?`, [req.params.id]);
    const product = rows[0];
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(serializeProduct(product));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', requireAccountTypes('BRAND', 'ADMIN'), async (req, res) => {
  const product = normalizeProductBody(req.body);

  if (!product.name || !Number.isFinite(product.price) || product.price < 0) {
    return res.status(400).json({ error: 'Product name and valid price are required' });
  }

  try {
    const brandId = req.user.accountType === 'BRAND' ? req.user.id : req.body.brandId || null;
    const result = await dbQuery(
      `INSERT INTO Products (
        name,
        description,
        price,
        category,
        material,
        images,
        stockQuantity,
        sizes,
        colors,
        brandId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product.name,
        product.description,
        product.price,
        product.category,
        product.material,
        product.images,
        product.stockQuantity,
        product.sizes,
        product.colors,
        brandId,
      ]
    );

    const rows = await dbQuery(`SELECT * FROM Products WHERE id = ?`, [result.insertId]);
    res.status(201).json({
      message: 'Product created',
      product: serializeProduct(rows[0]),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==========================================
// Shopping Cart & Orders
// ==========================================
app.post('/api/orders', async (req, res) => {
  const { items, totalAmount, shippingAddress } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must include at least one item' });
  }

  if (!Number.isFinite(Number(totalAmount)) || Number(totalAmount) < 0) {
    return res.status(400).json({ error: 'A valid total amount is required' });
  }

  try {
    const result = await dbQuery(
      `INSERT INTO Orders (
        userId,
        items,
        totalAmount,
        shippingAddress,
        paymentStatus,
        status
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        JSON.stringify(items),
        Number(totalAmount),
        JSON.stringify(shippingAddress || {}),
        'Paid (Dummy)',
        'Processing',
      ]
    );

    res.status(201).json({
      message: 'Order created successfully',
      orderId: result.insertId,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/orders/my-orders', async (req, res) => {
  try {
    const rows = await dbQuery(
      `SELECT * FROM Orders WHERE userId = ? ORDER BY createdAt DESC`,
      [req.user.id]
    );

    res.json(rows.map((order) => ({
      ...order,
      totalAmount: Number(order.totalAmount),
      items: parseJson(order.items, []),
      shippingAddress: parseJson(order.shippingAddress, {}),
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// Custom & B2B Orders
// ==========================================
app.post('/api/custom-orders', async (req, res) => {
  const { orderType, requirements, contactInfo } = req.body;

  if (!orderType) {
    return res.status(400).json({ error: 'Order type is required' });
  }

  try {
    const result = await dbQuery(
      `INSERT INTO CustomOrders (
        userId,
        orderType,
        requirements,
        contactInfo
      ) VALUES (?, ?, ?, ?)`,
      [
        req.user.id,
        orderType,
        JSON.stringify(requirements || {}),
        JSON.stringify(contactInfo || {}),
      ]
    );

    res.status(201).json({
      message: 'Custom order request submitted successfully',
      orderId: result.insertId,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/custom-orders/my-requests', async (req, res) => {
  try {
    const rows = await dbQuery(
      `SELECT * FROM CustomOrders WHERE userId = ? ORDER BY createdAt DESC`,
      [req.user.id]
    );

    res.json(rows.map((request) => ({
      ...request,
      requirements: parseJson(request.requirements, {}),
      contactInfo: parseJson(request.contactInfo, {}),
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// Contact Inquiries
// ==========================================
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !isValidEmail(email) || !message) {
    return res.status(400).json({ error: 'Name, valid email, and message are required' });
  }

  try {
    const result = await dbQuery(
      `INSERT INTO ContactMessages (name, email, subject, message) VALUES (?, ?, ?, ?)`,
      [name, String(email).trim().toLowerCase(), subject || '', message]
    );

    res.status(201).json({
      message: 'Contact message received',
      id: result.insertId,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/contact', requireAccountTypes('ADMIN'), async (req, res) => {
  try {
    const rows = await dbQuery(`SELECT * FROM ContactMessages ORDER BY createdAt DESC`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
