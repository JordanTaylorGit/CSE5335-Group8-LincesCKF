
CREATE DATABASE IF NOT EXISTS lincesckf CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lincesckf;

-- ── Users ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Users (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  firstName       VARCHAR(100),
  lastName        VARCHAR(100),
  email           VARCHAR(255) UNIQUE NOT NULL,
  passwordHash    VARCHAR(255) NOT NULL,
  phone           VARCHAR(30),
  accountType     ENUM('CUSTOMER', 'BRAND') DEFAULT 'CUSTOMER',
  companyName     VARCHAR(255),
  addresses       JSON,
  notificationPreferences JSON,
  createdAt       DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Products ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Products (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  nameEs        VARCHAR(255),
  description   TEXT,
  descriptionEs TEXT,
  price         DECIMAL(10,2) NOT NULL,
  category      VARCHAR(100),
  material      VARCHAR(255),
  images        JSON,
  stockQuantity INT DEFAULT 0,
  sizes         JSON,
  colors        JSON,
  featured      TINYINT(1) DEFAULT 0,
  brandId       INT,
  FOREIGN KEY (brandId) REFERENCES Users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Orders ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Orders (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  userId          INT,
  items           JSON NOT NULL,
  totalAmount     DECIMAL(10,2) NOT NULL,
  status          VARCHAR(50) DEFAULT 'Pending',
  shippingAddress JSON,
  paymentStatus   VARCHAR(50) DEFAULT 'Pending',
  createdAt       DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── CustomOrders ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS CustomOrders (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  userId      INT,
  orderType   VARCHAR(100) NOT NULL,
  contactInfo JSON,
  requirements TEXT,
  status      VARCHAR(50) DEFAULT 'New',
  createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── ContactMessages ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ContactMessages (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  name      VARCHAR(255) NOT NULL,
  email     VARCHAR(255) NOT NULL,
  subject   VARCHAR(255),
  message   TEXT NOT NULL,
  status    VARCHAR(50) DEFAULT 'Unread',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Seed Brands For Catalog Products ────────────────────────────
INSERT INTO Users (
  firstName,
  lastName,
  email,
  passwordHash,
  phone,
  accountType,
  companyName,
  addresses,
  notificationPreferences
) VALUES (
  '',
  '',
  'seda.atelier@lincesckf.com',
  '$2b$10$cVaiNEUxjRs0vAN/dwlp5O9ExYUHdEBN8.7HfB9ohNDyAwMuM6EMy',
  '+1 000 111 0001',
  'BRAND',
  'Seda Atelier',
  '[]',
  '{"email": true, "sms": false}'
)
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  accountType = 'BRAND',
  companyName = 'Seda Atelier',
  phone = '+1 000 111 0001';

SET @brand1Id = LAST_INSERT_ID();

INSERT INTO Users (
  firstName,
  lastName,
  email,
  passwordHash,
  phone,
  accountType,
  companyName,
  addresses,
  notificationPreferences
) VALUES (
  '',
  '',
  'casa.lunaria@lincesckf.com',
  '$2b$10$cVaiNEUxjRs0vAN/dwlp5O9ExYUHdEBN8.7HfB9ohNDyAwMuM6EMy',
  '+1 000 111 0002',
  'BRAND',
  'Casa Lunaria',
  '[]',
  '{"email": true, "sms": false}'
)
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  accountType = 'BRAND',
  companyName = 'Casa Lunaria',
  phone = '+1 000 111 0002';

SET @brand2Id = LAST_INSERT_ID();

INSERT INTO Users (
  firstName,
  lastName,
  email,
  passwordHash,
  phone,
  accountType,
  companyName,
  addresses,
  notificationPreferences
) VALUES (
  '',
  '',
  'brisa.silk@lincesckf.com',
  '$2b$10$cVaiNEUxjRs0vAN/dwlp5O9ExYUHdEBN8.7HfB9ohNDyAwMuM6EMy',
  '+1 000 111 0003',
  'BRAND',
  'Brisa Silk House',
  '[]',
  '{"email": true, "sms": false}'
)
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  accountType = 'BRAND',
  companyName = 'Brisa Silk House',
  phone = '+1 000 111 0003';

SET @brand3Id = LAST_INSERT_ID();

INSERT INTO Users (
  firstName,
  lastName,
  email,
  passwordHash,
  phone,
  accountType,
  companyName,
  addresses,
  notificationPreferences
) VALUES (
  '',
  '',
  'atelier.marfil@lincesckf.com',
  '$2b$10$cVaiNEUxjRs0vAN/dwlp5O9ExYUHdEBN8.7HfB9ohNDyAwMuM6EMy',
  '+1 000 111 0004',
  'BRAND',
  'Atelier Marfil',
  '[]',
  '{"email": true, "sms": false}'
)
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  accountType = 'BRAND',
  companyName = 'Atelier Marfil',
  phone = '+1 000 111 0004';

SET @brand4Id = LAST_INSERT_ID();


-- ── Seed Data: Products ─────────────────────────────────────────
INSERT INTO Products (name, description, price, category, material, images, stockQuantity, sizes, colors, featured, brandId) VALUES ('Classic Silk Blouse', 'Elegant 100% pure silk blouse with a tailored fit, perfect for professional or evening wear.', 120.0, 'blouse', '100% Silk', '["https://images.pexels.com/photos/19895950/pexels-photo-19895950.jpeg?cs=srgb&dl=pexels-marceloverfe-19895950.jpg&fm=jpg"]', 50, '["XS","S","M","L","XL"]', '["White","Navy","Burgundy"]', 1, @brand1Id);
INSERT INTO Products (name, description, price, category, material, images, stockQuantity, sizes, colors, featured, brandId) VALUES ('V-Neck Satin Blouse', 'A smooth satin finish blouse with a relaxed v-neckline for effortless elegance.', 95.0, 'blouse', 'Satin Silk Blend', '["https://images.pexels.com/photos/19895954/pexels-photo-19895954.jpeg?cs=srgb&dl=pexels-marceloverfe-19895954.jpg&fm=jpg"]', 40, '["S","M","L"]', '["Black","Rose","Silver"]', 1, @brand2Id);
INSERT INTO Products (name, description, price, category, material, images, stockQuantity, sizes, colors, featured, brandId) VALUES ('Ruffled Chiffon Blouse', 'Delicate and sheer chiffon blouse with ruffled detailing along the button placket.', 110.0, 'blouse', '100% Silk Chiffon', '["https://images.pexels.com/photos/22441278/pexels-photo-22441278.jpeg?cs=srgb&dl=pexels-dayong-tien-681073045-22441278.jpg&fm=jpg"]', 25, '["XS","S","M","L"]', '["Blush","Ivory"]', 1, @brand3Id);
INSERT INTO Products (name, description, price, category, material, images, stockQuantity, sizes, colors, featured, brandId) VALUES ('Wrap Style Silk Blouse', 'Flattering wrap silhouette with adjustable waist tie and draped long sleeves.', 135.0, 'blouse', '100% Charmeuse Silk', '["https://images.pexels.com/photos/22441291/pexels-photo-22441291.jpeg?cs=srgb&dl=pexels-dayong-tien-681073045-22441291.jpg&fm=jpg"]', 35, '["S","M","L","XL"]', '["Emerald","Midnight Blue"]', 1, @brand4Id);
INSERT INTO Products (name, description, price, category, material, images, stockQuantity, sizes, colors, featured, brandId) VALUES ('Evening Silk Dress', 'A flowing silk maxi dress featuring a cowl neckline and adjustable straps.', 250.0, 'dress', '95% Silk, 5% Elastane', '["https://images.pexels.com/photos/11813835/pexels-photo-11813835.jpeg?cs=srgb&dl=pexels-vladimir-konoplev-155326297-11813835.jpg&fm=jpg"]', 30, '["S","M","L"]', '["Black","Emerald","Champagne"]', 0, @brand1Id);
INSERT INTO Products (name, description, price, category, material, images, stockQuantity, sizes, colors, featured, brandId) VALUES ('Slip Silk Midi Dress', 'Classic 90s-inspired slip dress cut on the bias for a beautiful drape.', 195.0, 'dress', '100% Mulberry Silk', '["https://images.pexels.com/photos/8916598/pexels-photo-8916598.jpeg?cs=srgb&dl=pexels-leeloothefirst-8916598.jpg&fm=jpg"]', 45, '["XS","S","M","L","XL"]', '["Ruby","Sapphire","Pearl"]', 0, @brand2Id);
INSERT INTO Products (name, description, price, category, material, images, stockQuantity, sizes, colors, featured, brandId) VALUES ('Long Sleeve Wrap Dress', 'Sophisticated wrap dress with buttoned cuffs and a graceful asymmetric hem.', 280.0, 'dress', 'Heavyweight Silk Crepe', '["https://images.pexels.com/photos/19895965/pexels-photo-19895965.jpeg?cs=srgb&dl=pexels-marceloverfe-19895965.jpg&fm=jpg"]', 20, '["S","M","L"]', '["Navy","Plum"]', 0, @brand3Id);
INSERT INTO Products (name, description, price, category, material, images, stockQuantity, sizes, colors, featured, brandId) VALUES ('Halter Neck Silk Gown', 'Stunning floor-length gown with an open back and elegant halter neckline.', 350.0, 'dress', '100% Silk Charmeuse', '["https://images.pexels.com/photos/12290104/pexels-photo-12290104.jpeg?cs=srgb&dl=pexels-keynotez-12290104.jpg&fm=jpg"]', 15, '["XS","S","M"]', '["Crimson","Gold","Black"]', 0, @brand4Id);
INSERT INTO Products (name, description, price, category, material, images, stockQuantity, sizes, colors, featured, brandId) VALUES ('Essential Silk Shirt', 'A versatile button-down silk shirt for everyday luxury.', 145.0, 'shirt', '100% Washable Silk', '["https://images.pexels.com/photos/10131161/pexels-photo-10131161.jpeg?cs=srgb&dl=pexels-ron-lach-10131161.jpg&fm=jpg"]', 75, '["XS","S","M","L","XL","XXL"]', '["Ivory","Charcoal","Blush"]', 0, @brand1Id);
INSERT INTO Products (name, description, price, category, material, images, stockQuantity, sizes, colors, featured, brandId) VALUES ('Oversized Silk Button-Up', 'Relaxed, borrowed-from-the-boys fit with a beautifully fluid drape.', 160.0, 'shirt', '100% Silk Crepe de Chine', '["https://images.pexels.com/photos/14459666/pexels-photo-14459666.jpeg?cs=srgb&dl=pexels-feyzayildirimphoto-14459666.jpg&fm=jpg"]', 60, '["S","M","L"]', '["White","Light Blue","Olive"]', 0, @brand2Id);
INSERT INTO Products (name, description, price, category, material, images, stockQuantity, sizes, colors, featured, brandId) VALUES ('Short Sleeve Silk Shirt', 'Breezy short sleeve button-down with a camp collar for warm days.', 125.0, 'shirt', 'Lightweight Silk Blend', '["https://images.pexels.com/photos/22441295/pexels-photo-22441295.jpeg?cs=srgb&dl=pexels-dayong-tien-681073045-22441295.jpg&fm=jpg"]', 50, '["S","M","L","XL"]', '["Sand","Navy","Rust"]', 0, @brand3Id);
INSERT INTO Products (name, description, price, category, material, images, stockQuantity, sizes, colors, featured, brandId) VALUES ('Pintuck Detail Silk Shirt', 'Tailored shirt featuring intricate pintuck details down the front.', 175.0, 'shirt', '100% Silk Twill', '["https://images.pexels.com/photos/22441317/pexels-photo-22441317.jpeg?cs=srgb&dl=pexels-dayong-tien-681073045-22441317.jpg&fm=jpg"]', 30, '["XS","S","M","L"]', '["Black","Cream"]', 0, @brand4Id);
INSERT INTO Products (name, description, price, category, material, images, stockQuantity, sizes, colors, featured, brandId) VALUES ('Printed Silk Scarf', 'A 36" square silk twill scarf featuring an exclusive geometric print.', 65.0, 'scarf', '100% Silk Twill', '["https://images.pexels.com/photos/3844856/pexels-photo-3844856.jpeg?cs=srgb&dl=pexels-nuy-nuy-2192969-3844856.jpg&fm=jpg"]', 100, '["One Size"]', '["Geometric Print","Floral Print"]', 0, @brand1Id);
INSERT INTO Products (name, description, price, category, material, images, stockQuantity, sizes, colors, featured, brandId) VALUES ('Classic Skinny Silk Scarf', 'A versatile skinny scarf to tie around the neck, hair, or handbag.', 45.0, 'scarf', '100% Silk Charmeuse', '["https://images.pexels.com/photos/36455709/pexels-photo-36455709.jpeg?cs=srgb&dl=pexels-dauphotographer-36455709.jpg&fm=jpg"]', 120, '["One Size"]', '["Leopard","Polka Dot","Solid Black"]', 0, @brand2Id);
INSERT INTO Products (name, description, price, category, material, images, stockQuantity, sizes, colors, featured, brandId) VALUES ('Oversized Silk Wrap', 'Generously sized wrap that can be worn as a shawl or oversized scarf.', 110.0, 'scarf', 'Silk Cashmere Blend', '["https://images.pexels.com/photos/36455711/pexels-photo-36455711.jpeg?cs=srgb&dl=pexels-dauphotographer-36455711.jpg&fm=jpg"]', 40, '["One Size"]', '["Camel","Soft Grey","Navy"]', 0, @brand3Id);
INSERT INTO Products (name, description, price, category, material, images, stockQuantity, sizes, colors, featured, brandId) VALUES ('Artisan Hand-Dyed Scarf', 'Each piece is uniquely hand-dyed, making no two scarves exactly alike.', 85.0, 'scarf', '100% Habotai Silk', '["https://images.pexels.com/photos/36455718/pexels-photo-36455718.jpeg?cs=srgb&dl=pexels-dauphotographer-36455718.jpg&fm=jpg"]', 25, '["One Size"]', '["Ocean Blue","Sunset Orange","Amethyst"]', 0, @brand4Id);
