CREATE DATABASE IF NOT EXISTS lincesckf CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lincesckf;

CREATE TABLE IF NOT EXISTS users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  account_type ENUM('CUSTOMER', 'BRAND', 'ADMIN') NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  company_name VARCHAR(200),
  phone VARCHAR(30),
  preferred_language ENUM('EN', 'ES') NOT NULL DEFAULT 'EN',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  notification_preferences JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS addresses (
  address_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  address_type ENUM('SHIPPING', 'BILLING') NOT NULL,
  recipient_name VARCHAR(150),
  street_address VARCHAR(255) NOT NULL,
  street_address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state_region VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) NOT NULL,
  phone VARCHAR(30),
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT fk_addresses_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS categories (
  category_id INT PRIMARY KEY AUTO_INCREMENT,
  name_en VARCHAR(150) NOT NULL,
  name_es VARCHAR(150),
  description_en TEXT,
  description_es TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE KEY uq_categories_name_en (name_en)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS products (
  product_id INT PRIMARY KEY AUTO_INCREMENT,
  category_id INT NOT NULL,
  brand_user_id INT NULL,
  sku VARCHAR(100) NOT NULL UNIQUE,
  name_en VARCHAR(200) NOT NULL,
  name_es VARCHAR(200),
  description_en TEXT,
  description_es TEXT,
  image VARCHAR(500),
  image_urls JSON,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  product_type ENUM('PHYSICAL', 'DIGITAL', 'SERVICE') NOT NULL DEFAULT 'PHYSICAL',
  material VARCHAR(150),
  weight DECIMAL(10,2) CHECK (weight IS NULL OR weight >= 0),
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  sizes_json JSON,
  colors_json JSON,
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_products_brand
    FOREIGN KEY (brand_user_id) REFERENCES users(user_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS shopping_carts (
  cart_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NULL,
  session_id VARCHAR(200),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_carts_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  UNIQUE KEY uq_active_cart_per_user (user_id, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS cart_items (
  cart_item_id INT PRIMARY KEY AUTO_INCREMENT,
  cart_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  selected_size VARCHAR(50),
  selected_color VARCHAR(50),
  CONSTRAINT fk_cartitems_cart
    FOREIGN KEY (cart_id) REFERENCES shopping_carts(cart_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_cartitems_product
    FOREIGN KEY (product_id) REFERENCES products(product_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  UNIQUE KEY uq_cartitem_variant (cart_id, product_id, selected_size, selected_color)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS orders (
  order_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  order_number VARCHAR(100) NOT NULL UNIQUE,
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  order_status ENUM('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
  payment_method ENUM('CARD', 'BANK', 'CASH', 'OTHER') NOT NULL DEFAULT 'CARD',
  payment_status ENUM('UNPAID', 'PAID', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'UNPAID',
  shipping_address_id INT NULL,
  billing_address_id INT NULL,
  order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_orders_shipping_address
    FOREIGN KEY (shipping_address_id) REFERENCES addresses(address_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  CONSTRAINT fk_orders_billing_address
    FOREIGN KEY (billing_address_id) REFERENCES addresses(address_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS order_items (
  order_item_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  brand_user_id INT NULL,
  product_name_en VARCHAR(200),
  product_name_es VARCHAR(200),
  product_image VARCHAR(500),
  brand_name_snapshot VARCHAR(200),
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  subtotal DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  selected_size VARCHAR(50),
  selected_color VARCHAR(50),
  delivery_status ENUM('PROCESSING', 'DELIVERED') NOT NULL DEFAULT 'PROCESSING',
  delivered_at TIMESTAMP NULL,
  CONSTRAINT fk_orderitems_order
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_orderitems_product
    FOREIGN KEY (product_id) REFERENCES products(product_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_orderitems_brand
    FOREIGN KEY (brand_user_id) REFERENCES users(user_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS payments (
  payment_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  payment_method ENUM('CARD', 'BANK', 'CASH', 'OTHER') NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  payment_status ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
  paid_at TIMESTAMP NULL,
  CONSTRAINT fk_payments_order
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS service_types (
  service_type_id INT PRIMARY KEY AUTO_INCREMENT,
  name_en VARCHAR(150) NOT NULL,
  name_es VARCHAR(150),
  description_en TEXT,
  description_es TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE KEY uq_service_types_name_en (name_en)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS custom_orders (
  custom_order_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  service_type_id INT NOT NULL,
  request_number VARCHAR(100) UNIQUE,
  company_name VARCHAR(200),
  project_description TEXT,
  quantity INT NOT NULL CHECK (quantity > 0),
  request_status ENUM('NEW', 'IN_REVIEW', 'QUOTED', 'APPROVED', 'IN_PRODUCTION', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'NEW',
  quote_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (quote_amount >= 0),
  expected_delivery_date DATE,
  internal_notes TEXT,
  timeline VARCHAR(100),
  contact_name VARCHAR(150),
  contact_email VARCHAR(150),
  contact_phone VARCHAR(30),
  requirements_json JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_customorders_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_customorders_servicetype
    FOREIGN KEY (service_type_id) REFERENCES service_types(service_type_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS service_inquiries (
  inquiry_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NULL,
  company_name VARCHAR(200),
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_serviceinquiries_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS contact_forms (
  contact_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NULL,
  name VARCHAR(150),
  email VARCHAR(150),
  subject VARCHAR(200),
  message TEXT,
  inquiry_type ENUM('GENERAL', 'ORDER', 'SERVICE', 'OTHER') NOT NULL,
  status ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED') NOT NULL DEFAULT 'OPEN',
  response_message TEXT,
  responded_at TIMESTAMP NULL,
  CONSTRAINT fk_contactforms_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO categories (name_en, name_es, description_en, description_es, is_active) VALUES
  ('blouse', 'blusa', 'Silk blouse collection', 'Coleccion de blusas de seda', TRUE),
  ('dress', 'vestido', 'Silk dress collection', 'Coleccion de vestidos de seda', TRUE),
  ('shirt', 'camisa', 'Silk shirt collection', 'Coleccion de camisas de seda', TRUE),
  ('scarf', 'panuelo', 'Silk scarf collection', 'Coleccion de panuelos de seda', TRUE)
ON DUPLICATE KEY UPDATE
  name_es = VALUES(name_es),
  description_en = VALUES(description_en),
  description_es = VALUES(description_es),
  is_active = VALUES(is_active);

INSERT INTO service_types (name_en, name_es, description_en, description_es, is_active) VALUES
  ('custom-garment', 'prenda-personalizada', 'Single bespoke garment requests', 'Solicitudes de prendas personalizadas', TRUE),
  ('bulk-order', 'pedido-mayorista', 'Bulk catalog order requests', 'Solicitudes de pedidos al por mayor', TRUE),
  ('b2b-manufacturing', 'manufactura-b2b', 'Brand manufacturing partnerships', 'Alianzas de manufactura para marcas', TRUE)
ON DUPLICATE KEY UPDATE
  name_es = VALUES(name_es),
  description_en = VALUES(description_en),
  description_es = VALUES(description_es),
  is_active = VALUES(is_active);

INSERT INTO users (
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
) VALUES
  ('customer.demo@lincesckf.com', '$2b$10$vQYcKUEQXcr26j8ksE87I.od/yD3TfIWZVDUqJhUi9P5Y9NcchQiu', 'CUSTOMER', 'Demo', 'Customer', '', '+1 000 222 0001', 'EN', TRUE, '{"email": true, "sms": false}'),
  ('seda.atelier@lincesckf.com', '$2b$10$cVaiNEUxjRs0vAN/dwlp5O9ExYUHdEBN8.7HfB9ohNDyAwMuM6EMy', 'BRAND', '', '', 'Seda Atelier', '+1 000 111 0001', 'EN', TRUE, '{"email": true, "sms": false}'),
  ('casa.lunaria@lincesckf.com', '$2b$10$cVaiNEUxjRs0vAN/dwlp5O9ExYUHdEBN8.7HfB9ohNDyAwMuM6EMy', 'BRAND', '', '', 'Casa Lunaria', '+1 000 111 0002', 'EN', TRUE, '{"email": true, "sms": false}'),
  ('brisa.silk@lincesckf.com', '$2b$10$cVaiNEUxjRs0vAN/dwlp5O9ExYUHdEBN8.7HfB9ohNDyAwMuM6EMy', 'BRAND', '', '', 'Brisa Silk House', '+1 000 111 0003', 'EN', TRUE, '{"email": true, "sms": false}'),
  ('atelier.marfil@lincesckf.com', '$2b$10$cVaiNEUxjRs0vAN/dwlp5O9ExYUHdEBN8.7HfB9ohNDyAwMuM6EMy', 'BRAND', '', '', 'Atelier Marfil', '+1 000 111 0004', 'EN', TRUE, '{"email": true, "sms": false}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  account_type = VALUES(account_type),
  first_name = VALUES(first_name),
  last_name = VALUES(last_name),
  company_name = VALUES(company_name),
  phone = VALUES(phone),
  notification_preferences = VALUES(notification_preferences);

INSERT INTO products (
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
)
SELECT
  c.category_id,
  u.user_id,
  seeded.sku,
  seeded.name_en,
  seeded.name_es,
  seeded.description_en,
  seeded.description_es,
  seeded.image,
  JSON_ARRAY(seeded.image),
  seeded.price,
  seeded.stock_quantity,
  'PHYSICAL',
  seeded.material,
  NULL,
  seeded.is_featured,
  seeded.sizes_json,
  seeded.colors_json
FROM (
  SELECT 'BLOU-CLASSIC' AS sku, 'blouse' AS category_name, 'seda.atelier@lincesckf.com' AS brand_email, 'Classic Silk Blouse' AS name_en, 'Classic Silk Blouse' AS name_es, 'Elegant 100% pure silk blouse with a tailored fit, perfect for professional or evening wear.' AS description_en, 'Elegant 100% pure silk blouse with a tailored fit, perfect for professional or evening wear.' AS description_es, 'https://images.pexels.com/photos/19895950/pexels-photo-19895950.jpeg?cs=srgb&dl=pexels-marceloverfe-19895950.jpg&fm=jpg' AS image, 120.00 AS price, 50 AS stock_quantity, '100% Silk' AS material, TRUE AS is_featured, '[{"name":"XS","stockQuantity":10},{"name":"S","stockQuantity":10},{"name":"M","stockQuantity":10},{"name":"L","stockQuantity":10},{"name":"XL","stockQuantity":10}]' AS sizes_json, '["White","Navy","Burgundy"]' AS colors_json
  UNION ALL
  SELECT 'BLOU-VNECK', 'blouse', 'casa.lunaria@lincesckf.com', 'V-Neck Satin Blouse', 'V-Neck Satin Blouse', 'A smooth satin finish blouse with a relaxed v-neckline for effortless elegance.', 'A smooth satin finish blouse with a relaxed v-neckline for effortless elegance.', 'https://images.pexels.com/photos/19895954/pexels-photo-19895954.jpeg?cs=srgb&dl=pexels-marceloverfe-19895954.jpg&fm=jpg', 95.00, 40, 'Satin Silk Blend', TRUE, '[{"name":"S","stockQuantity":14},{"name":"M","stockQuantity":13},{"name":"L","stockQuantity":13}]', '["Black","Rose","Silver"]'
  UNION ALL
  SELECT 'BLOU-RUFFLE', 'blouse', 'brisa.silk@lincesckf.com', 'Ruffled Chiffon Blouse', 'Ruffled Chiffon Blouse', 'Delicate and sheer chiffon blouse with ruffled detailing along the button placket.', 'Delicate and sheer chiffon blouse with ruffled detailing along the button placket.', 'https://images.pexels.com/photos/22441278/pexels-photo-22441278.jpeg?cs=srgb&dl=pexels-dayong-tien-681073045-22441278.jpg&fm=jpg', 110.00, 25, '100% Silk Chiffon', TRUE, '[{"name":"XS","stockQuantity":7},{"name":"S","stockQuantity":6},{"name":"M","stockQuantity":6},{"name":"L","stockQuantity":6}]', '["Blush","Ivory"]'
  UNION ALL
  SELECT 'BLOU-WRAP', 'blouse', 'atelier.marfil@lincesckf.com', 'Wrap Style Silk Blouse', 'Wrap Style Silk Blouse', 'Flattering wrap silhouette with adjustable waist tie and draped long sleeves.', 'Flattering wrap silhouette with adjustable waist tie and draped long sleeves.', 'https://images.pexels.com/photos/22441291/pexels-photo-22441291.jpeg?cs=srgb&dl=pexels-dayong-tien-681073045-22441291.jpg&fm=jpg', 135.00, 35, '100% Charmeuse Silk', TRUE, '[{"name":"S","stockQuantity":9},{"name":"M","stockQuantity":9},{"name":"L","stockQuantity":9},{"name":"XL","stockQuantity":8}]', '["Emerald","Midnight Blue"]'
) AS seeded
JOIN categories c ON c.name_en = seeded.category_name
JOIN users u ON u.email = seeded.brand_email
WHERE NOT EXISTS (
  SELECT 1 FROM products existing WHERE existing.sku = seeded.sku
);
