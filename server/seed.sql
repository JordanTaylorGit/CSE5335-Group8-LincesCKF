CREATE DATABASE IF NOT EXISTS linces_db;
USE linces_db;

CREATE TABLE IF NOT EXISTS Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(255),
  lastName VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  accountType VARCHAR(50) DEFAULT 'CUSTOMER',
  companyName VARCHAR(255),
  addresses JSON,
  notificationPreferences JSON
);

CREATE TABLE IF NOT EXISTS Products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  material VARCHAR(255),
  images JSON,
  stockQuantity INT DEFAULT 0,
  sizes JSON,
  colors JSON,
  brandId INT,
  FOREIGN KEY (brandId) REFERENCES Users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  items JSON NOT NULL,
  totalAmount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending',
  shippingAddress JSON,
  paymentStatus VARCHAR(50) DEFAULT 'Pending',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS CustomOrders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  orderType VARCHAR(100) NOT NULL,
  contactInfo JSON,
  requirements JSON,
  status VARCHAR(50) DEFAULT 'New',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ContactMessages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'Unread',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Products
INSERT INTO Products (name, description, price, category, material, images, stockQuantity, sizes, colors) VALUES 
('Classic Silk Blouse', 'Elegant 100% pure silk blouse with a tailored fit, perfect for professional or evening wear.', 120.00, 'blouse', '100% Silk', '["https://images.unsplash.com/photo-1564257631407-4deb1f99d992?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]', 50, '["XS", "S", "M", "L", "XL"]', '["White", "Navy", "Burgundy"]'),
('V-Neck Satin Blouse', 'A smooth satin finish blouse with a relaxed v-neckline for effortless elegance.', 95.00, 'blouse', 'Satin Silk Blend', '["https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]', 40, '["S", "M", "L"]', '["Black", "Rose", "Silver"]'),
('Ruffled Chiffon Blouse', 'Delicate and sheer chiffon blouse with ruffled detailing along the button placket.', 110.00, 'blouse', '100% Silk Chiffon', '["https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]', 25, '["XS", "S", "M", "L"]', '["Blush", "Ivory"]'),
('Evening Silk Dress', 'A flowing silk maxi dress featuring a cowl neckline and adjustable straps.', 250.00, 'dress', '95% Silk, 5% Elastane', '["https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]', 30, '["S", "M", "L"]', '["Black", "Emerald", "Champagne"]'),
('Essential Silk Shirt', 'A versatile button-down silk shirt for everyday luxury.', 145.00, 'shirt', '100% Washable Silk', '["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]', 75, '["XS", "S", "M", "L", "XL", "XXL"]', '["Ivory", "Charcoal", "Blush"]'),
('Printed Silk Scarf', 'A 36" square silk twill scarf featuring an exclusive geometric print.', 65.00, 'scarf', '100% Silk Twill', '["https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]', 100, '["One Size"]', '["Geometric Print", "Floral Print"]');