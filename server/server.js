const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_for_lincesckf';

// ==========================================
// Auth Middleware
// ==========================================
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const token = authHeader.split(' ')[1];
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// ==========================================
// 3.1 Authentication
// ==========================================
app.post('/api/auth/register', async (req, res) => {
  const { firstName, lastName, email, password, phone, accountType, companyName } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO Users 
      (firstName, lastName, email, passwordHash, phone, accountType, companyName) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
      firstName,
      lastName,
      email,
      passwordHash,
      phone,
      accountType || 'CUSTOMER',
      companyName
    ], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: err.message });
      }

      const userPayload = { id: result.insertId, email, accountType: accountType || 'CUSTOMER' };
      const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '1d' });

      res.status(201).json({ message: 'User registered', userId: result.insertId, token });
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  db.query(`SELECT * FROM Users WHERE email = ?`, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, accountType: user.accountType },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    delete user.passwordHash;
    res.json({ message: 'Login successful', token, user });
  });
});

app.get('/api/users/profile', authMiddleware, (req, res) => {
  db.query(
    `SELECT id, firstName, lastName, email, phone, accountType, companyName, addresses, notificationPreferences 
     FROM Users WHERE id = ?`,
    [req.user.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ error: 'User not found' });
      res.json(results[0]);
    }
  );
});

app.put('/api/users/profile', authMiddleware, (req, res) => {
  const { firstName, lastName, email, phone, companyName, addresses } = req.body;

  db.query(
    `UPDATE Users SET firstName=?, lastName=?, email=?, phone=?, companyName=?, addresses=? WHERE id=?`,
    [firstName, lastName, email, phone, companyName, JSON.stringify(addresses), req.user.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Profile updated' });
    }
  );
});

// ==========================================
// 3.2 Products
// ==========================================
app.get('/api/products', (req, res) => {
  db.query(`SELECT * FROM Products`, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/products/:id', (req, res) => {
  db.query(`SELECT * FROM Products WHERE id = ?`, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(results[0]);
  });
});

app.post('/api/products', authMiddleware, (req, res) => {
  if (req.user.accountType !== 'BRAND') {
    return res.status(403).json({ error: 'Only brands can create products' });
  }

  const { name, description, price, category, material, images, stockQuantity, sizes, colors } = req.body;

  const sql = `
    INSERT INTO Products 
    (name, description, price, category, material, images, stockQuantity, sizes, colors, brandId) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    name,
    description,
    price,
    category,
    material,
    JSON.stringify(images),
    stockQuantity || 0,
    JSON.stringify(sizes),
    JSON.stringify(colors),
    req.user.id
  ], (err, result) => {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json({ message: 'Product created', id: result.insertId });
  });
});

// ==========================================
// 3.3 Orders
// ==========================================
app.post('/api/orders', authMiddleware, (req, res) => {
  const { items, totalAmount, shippingAddress } = req.body;

  db.query(
    `INSERT INTO Orders (userId, items, totalAmount, shippingAddress, paymentStatus, status) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      req.user.id,
      JSON.stringify(items),
      totalAmount,
      JSON.stringify(shippingAddress),
      'Paid (Dummy)',
      'Processing'
    ],
    (err, result) => {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ message: 'Order created', orderId: result.insertId });
    }
  );
});

app.get('/api/orders/my-orders', authMiddleware, (req, res) => {
  db.query(
    `SELECT * FROM Orders WHERE userId = ? ORDER BY createdAt DESC`,
    [req.user.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// ==========================================
// Contact
// ==========================================
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  db.query(
    `INSERT INTO ContactMessages (name, email, subject, message) VALUES (?, ?, ?, ?)`,
    [name, email, subject, message],
    (err, result) => {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ message: 'Message received', id: result.insertId });
    }
  );
});

app.get('/api/contact', (req, res) => {
  db.query(`SELECT * FROM ContactMessages ORDER BY createdAt DESC`, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ==========================================
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
