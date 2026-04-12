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
    db.run(sql, [firstName, lastName, email, passwordHash, phone, accountType || 'CUSTOMER', companyName], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: err.message });
      }
      
      const userPayload = { id: this.lastID, email, accountType: accountType || 'CUSTOMER' };
      const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '1d' });
      
      res.status(201).json({ message: 'User registered successfully', userId: this.lastID, token });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get(`SELECT * FROM Users WHERE email = ?`, [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
    
    const userPayload = { id: user.id, email: user.email, accountType: user.accountType };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '1d' });
    
    // Remove passwordHash from response
    delete user.passwordHash;
    res.json({ message: 'Login successful', token, user });
  });
});

app.get('/api/users/profile', authMiddleware, (req, res) => {
  db.get(`SELECT id, firstName, lastName, email, phone, accountType, companyName, addresses, notificationPreferences FROM Users WHERE id = ?`, [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  });
});

app.put('/api/users/profile', authMiddleware, (req, res) => {
  const { firstName, lastName, email, phone, companyName, addresses } = req.body;
  const sql = `UPDATE Users SET firstName = ?, lastName = ?, email = ?, phone = ?, companyName = ?, addresses = ? WHERE id = ?`;
  db.run(sql, [firstName, lastName, email, phone, companyName, JSON.stringify(addresses), req.user.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Profile updated successfully' });
  });
});

// ==========================================
// 3.2 Product Catalog
// ==========================================
app.get('/api/products', (req, res) => {
  db.all(`SELECT * FROM Products`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/products/:id', (req, res) => {
  db.get(`SELECT * FROM Products WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Product not found' });
    res.json(row);
  });
});

app.post('/api/products', authMiddleware, (req, res) => {
  // Normally we would check if req.user.accountType === 'ADMIN'
  const { name, description, price, category, material, images, stockQuantity, sizes, colors } = req.body;
  const sql = `INSERT INTO Products (name, description, price, category, material, images, stockQuantity, sizes, colors) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [name, description, price, category, material, JSON.stringify(images), stockQuantity || 0, JSON.stringify(sizes), JSON.stringify(colors)], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json({ message: 'Product created', id: this.lastID });
  });
});

// ==========================================
// 3.3 Shopping Cart & Orders
// ==========================================
app.post('/api/orders', authMiddleware, (req, res) => {
  const { items, totalAmount, shippingAddress } = req.body;
  db.run(`INSERT INTO Orders (userId, items, totalAmount, shippingAddress, paymentStatus, status) VALUES (?, ?, ?, ?, ?, ?)`,
    [req.user.id, JSON.stringify(items), totalAmount, JSON.stringify(shippingAddress), 'Paid (Dummy)', 'Processing'], function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ message: 'Order created successfully', orderId: this.lastID });
  });
});

app.get('/api/orders/my-orders', authMiddleware, (req, res) => {
  db.all(`SELECT * FROM Orders WHERE userId = ? ORDER BY createdAt DESC`, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
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

app.post('/api/custom-orders', optionalAuth, (req, res) => {
  const { orderType, requirements, contactInfo } = req.body;
  db.run(`INSERT INTO CustomOrders (userId, orderType, requirements, contactInfo) VALUES (?, ?, ?, ?)`,
    [req.user.id, orderType, JSON.stringify(requirements), JSON.stringify(contactInfo)], function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ message: 'Custom order request submitted successfully', orderId: this.lastID });
  });
});

app.get('/api/custom-orders/my-requests', authMiddleware, (req, res) => {
  db.all(`SELECT * FROM CustomOrders WHERE userId = ? ORDER BY createdAt DESC`, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ==========================================
// 3.5 Contact Inquiries
// ==========================================
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  db.run(`INSERT INTO ContactMessages (name, email, subject, message) VALUES (?, ?, ?, ?)`,
    [name, email, subject, message], function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ message: 'Contact message received', id: this.lastID });
  });
});

app.get('/api/contact', authMiddleware, (req, res) => {
  // Admin only normally
  db.all(`SELECT * FROM ContactMessages ORDER BY createdAt DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
