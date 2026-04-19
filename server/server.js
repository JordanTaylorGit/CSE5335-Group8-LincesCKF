const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_for_lincesckf';

// Proper JWT Auth Middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, accountType }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// ==========================================
// 3.1 Authentication & User Management
// ==========================================
app.post('/api/auth/register', async (req, res) => {
  const { firstName, lastName, email, password, phone, accountType, companyName } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const sql = `INSERT INTO Users (firstName, lastName, email, passwordHash, phone, accountType, companyName) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await db.execute(sql, [firstName, lastName, email, passwordHash, phone, accountType || 'CUSTOMER', companyName]);
    
    const userPayload = { id: result.insertId, email, accountType: accountType || 'CUSTOMER' };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '1d' });
    
    res.status(201).json({ message: 'User registered successfully', userId: result.insertId, token });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const [rows] = await db.execute(`SELECT * FROM Users WHERE email = ?`, [email]);
    const user = rows[0];
    
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
    
    const userPayload = { id: user.id, email: user.email, accountType: user.accountType };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '1d' });
    
    delete user.passwordHash;
    res.json({ message: 'Login successful', token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/profile', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.execute(`SELECT id, firstName, lastName, email, phone, accountType, companyName, addresses, notificationPreferences FROM Users WHERE id = ?`, [req.user.id]);
    const user = rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/profile', authMiddleware, async (req, res) => {
  const { firstName, lastName, email, phone, companyName, addresses } = req.body;
  const sql = `UPDATE Users SET firstName = ?, lastName = ?, email = ?, phone = ?, companyName = ?, addresses = ? WHERE id = ?`;
  try {
    await db.execute(sql, [firstName, lastName, email, phone, companyName, JSON.stringify(addresses), req.user.id]);
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 3.2 Product Catalog
// ==========================================
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await db.execute(`SELECT * FROM Products`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const [rows] = await db.execute(`SELECT * FROM Products WHERE id = ?`, [req.params.id]);
    const row = rows[0];
    if (!row) return res.status(404).json({ error: 'Product not found' });
    res.json(row);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/brand/my-products', authMiddleware, async (req, res) => {
  if (req.user.accountType !== 'BRAND') {
    return res.status(403).json({ error: 'Access denied: Only brands can view their products' });
  }
  try {
    const [rows] = await db.execute(`SELECT * FROM Products WHERE brandId = ? ORDER BY id DESC`, [req.user.id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', authMiddleware, async (req, res) => {
  if (req.user.accountType !== 'BRAND') {
    return res.status(403).json({ error: 'Access denied: Only brands can create products' });
  }
  const { name, description, price, category, material, images, stockQuantity, sizes, colors } = req.body;
  const brandId = req.user.id;
  const sql = `INSERT INTO Products (name, description, price, category, material, images, stockQuantity, sizes, colors, brandId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  try {
    const [result] = await db.execute(sql, [name, description, price, category, material, JSON.stringify(images), stockQuantity || 0, JSON.stringify(sizes), JSON.stringify(colors), brandId]);
    res.status(201).json({ message: 'Product created', id: result.insertId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==========================================
// 3.3 Shopping Cart & Orders
// ==========================================
app.post('/api/orders', authMiddleware, async (req, res) => {
  const { items, totalAmount, shippingAddress } = req.body;
  try {
    const [result] = await db.execute(`INSERT INTO Orders (userId, items, totalAmount, shippingAddress, paymentStatus, status) VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, JSON.stringify(items), totalAmount, JSON.stringify(shippingAddress), 'Paid (Dummy)', 'Processing']);
    res.status(201).json({ message: 'Order created successfully', orderId: result.insertId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/orders/my-orders', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.execute(`SELECT * FROM Orders WHERE userId = ? ORDER BY createdAt DESC`, [req.user.id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 3.4 Custom & B2B Orders
// ==========================================
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = { id: null };
    return next();
  }
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
  } catch(e) {
    req.user = { id: null };
  }
  next();
};

app.post('/api/custom-orders', optionalAuth, async (req, res) => {
  const { orderType, requirements, contactInfo } = req.body;
  try {
    const [result] = await db.execute(`INSERT INTO CustomOrders (userId, orderType, requirements, contactInfo) VALUES (?, ?, ?, ?)`,
      [req.user.id, orderType, JSON.stringify(requirements), JSON.stringify(contactInfo)]);
    res.status(201).json({ message: 'Custom order request submitted successfully', orderId: result.insertId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/custom-orders/my-requests', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.execute(`SELECT * FROM CustomOrders WHERE userId = ? ORDER BY createdAt DESC`, [req.user.id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 3.5 Contact Inquiries
// ==========================================
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    const [result] = await db.execute(`INSERT INTO ContactMessages (name, email, subject, message) VALUES (?, ?, ?, ?)`,
      [name, email, subject, message]);
    res.status(201).json({ message: 'Contact message received', id: result.insertId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/contact', authMiddleware, async (req, res) => {
  // Admin only normally
  try {
    const [rows] = await db.execute(`SELECT * FROM ContactMessages ORDER BY createdAt DESC`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
