/* Student 1 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

const bcrypt = require('bcryptjs');
const db = require('./config/db');

// Seed data used for local development
const SEEDED_BRAND_PASSWORD = 'BrandSeed123!';
const SEEDED_CUSTOMER_PASSWORD = 'CustomerSeed123!';
const SEEDED_CUSTOMER = {
  email: 'customer.demo@lincesckf.com',
  firstName: 'Demo',
  lastName: 'Customer',
  phone: '+1 000 222 0001',
};
const SEEDED_BRANDS = [
  {
    email: 'seda.atelier@lincesckf.com',
    companyName: 'Seda Atelier',
    phone: '+1 000 111 0001',
  },
  {
    email: 'casa.lunaria@lincesckf.com',
    companyName: 'Casa Lunaria',
    phone: '+1 000 111 0002',
  },
  {
    email: 'brisa.silk@lincesckf.com',
    companyName: 'Brisa Silk House',
    phone: '+1 000 111 0003',
  },
  {
    email: 'atelier.marfil@lincesckf.com',
    companyName: 'Atelier Marfil',
    phone: '+1 000 111 0004',
  },
];

const initialProducts = [
  // BLOUSES
  {
    name: 'Classic Silk Blouse',
    description: 'Elegant 100% pure silk blouse with a tailored fit, perfect for professional or evening wear.',
    price: 120.00,
    category: 'blouse',
    material: '100% Silk',
    images: ['https://images.pexels.com/photos/19895950/pexels-photo-19895950.jpeg?cs=srgb&dl=pexels-marceloverfe-19895950.jpg&fm=jpg'],
    stockQuantity: 50,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Navy', 'Burgundy'],
    featured: 1
  },
  {
    name: 'V-Neck Satin Blouse',
    description: 'A smooth satin finish blouse with a relaxed v-neckline for effortless elegance.',
    price: 95.00,
    category: 'blouse',
    material: 'Satin Silk Blend',
    images: ['https://images.pexels.com/photos/19895954/pexels-photo-19895954.jpeg?cs=srgb&dl=pexels-marceloverfe-19895954.jpg&fm=jpg'],
    stockQuantity: 40,
    sizes: ['S', 'M', 'L'],
    colors: ['Black', 'Rose', 'Silver'],
    featured: 1
  },
  {
    name: 'Ruffled Chiffon Blouse',
    description: 'Delicate and sheer chiffon blouse with ruffled detailing along the button placket.',
    price: 110.00,
    category: 'blouse',
    material: '100% Silk Chiffon',
    images: ['https://images.pexels.com/photos/22441278/pexels-photo-22441278.jpeg?cs=srgb&dl=pexels-dayong-tien-681073045-22441278.jpg&fm=jpg'],
    stockQuantity: 25,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Blush', 'Ivory'],
    featured: 1
  },
  {
    name: 'Wrap Style Silk Blouse',
    description: 'Flattering wrap silhouette with adjustable waist tie and draped long sleeves.',
    price: 135.00,
    category: 'blouse',
    material: '100% Charmeuse Silk',
    images: ['https://images.pexels.com/photos/22441291/pexels-photo-22441291.jpeg?cs=srgb&dl=pexels-dayong-tien-681073045-22441291.jpg&fm=jpg'],
    stockQuantity: 35,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Emerald', 'Midnight Blue'],
    featured: 1
  },
 
  // DRESSES
  {
    name: 'Evening Silk Dress',
    description: 'A flowing silk maxi dress featuring a cowl neckline and adjustable straps.',
    price: 250.00,
    category: 'dress',
    material: '95% Silk, 5% Elastane',
    images: ['https://images.pexels.com/photos/11813835/pexels-photo-11813835.jpeg?cs=srgb&dl=pexels-vladimir-konoplev-155326297-11813835.jpg&fm=jpg'],
    stockQuantity: 30,
    sizes: ['S', 'M', 'L'],
    colors: ['Black', 'Emerald', 'Champagne'],
    featured: 0
  },
  {
    name: 'Slip Silk Midi Dress',
    description: 'Classic 90s-inspired slip dress cut on the bias for a beautiful drape.',
    price: 195.00,
    category: 'dress',
    material: '100% Mulberry Silk',
    images: ['https://images.pexels.com/photos/8916598/pexels-photo-8916598.jpeg?cs=srgb&dl=pexels-leeloothefirst-8916598.jpg&fm=jpg'],
    stockQuantity: 45,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Ruby', 'Sapphire', 'Pearl'],
    featured: 0
  },
  {
    name: 'Long Sleeve Wrap Dress',
    description: 'Sophisticated wrap dress with buttoned cuffs and a graceful asymmetric hem.',
    price: 280.00,
    category: 'dress',
    material: 'Heavyweight Silk Crepe',
    images: ['https://images.pexels.com/photos/19895965/pexels-photo-19895965.jpeg?cs=srgb&dl=pexels-marceloverfe-19895965.jpg&fm=jpg'],
    stockQuantity: 20,
    sizes: ['S', 'M', 'L'],
    colors: ['Navy', 'Plum'],
    featured: 0
  },
  {
    name: 'Halter Neck Silk Gown',
    description: 'Stunning floor-length gown with an open back and elegant halter neckline.',
    price: 350.00,
    category: 'dress',
    material: '100% Silk Charmeuse',
    images: ['https://images.pexels.com/photos/12290104/pexels-photo-12290104.jpeg?cs=srgb&dl=pexels-keynotez-12290104.jpg&fm=jpg'],
    stockQuantity: 15,
    sizes: ['XS', 'S', 'M'],
    colors: ['Crimson', 'Gold', 'Black'],
    featured: 0
  },
 
  // SHIRTS
  {
    name: 'Essential Silk Shirt',
    description: 'A versatile button-down silk shirt for everyday luxury.',
    price: 145.00,
    category: 'shirt',
    material: '100% Washable Silk',
    images: ['https://images.pexels.com/photos/10131161/pexels-photo-10131161.jpeg?cs=srgb&dl=pexels-ron-lach-10131161.jpg&fm=jpg'],
    stockQuantity: 75,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Ivory', 'Charcoal', 'Blush'],
    featured: 0
  },
  {
    name: 'Oversized Silk Button-Up',
    description: 'Relaxed, borrowed-from-the-boys fit with a beautifully fluid drape.',
    price: 160.00,
    category: 'shirt',
    material: '100% Silk Crepe de Chine',
    images: ['https://images.pexels.com/photos/14459666/pexels-photo-14459666.jpeg?cs=srgb&dl=pexels-feyzayildirimphoto-14459666.jpg&fm=jpg'],
    stockQuantity: 60,
    sizes: ['S', 'M', 'L'],
    colors: ['White', 'Light Blue', 'Olive'],
    featured: 0
  },
  {
    name: 'Short Sleeve Silk Shirt',
    description: 'Breezy short sleeve button-down with a camp collar for warm days.',
    price: 125.00,
    category: 'shirt',
    material: 'Lightweight Silk Blend',
    images: ['https://images.pexels.com/photos/22441295/pexels-photo-22441295.jpeg?cs=srgb&dl=pexels-dayong-tien-681073045-22441295.jpg&fm=jpg'],
    stockQuantity: 50,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Sand', 'Navy', 'Rust'],
    featured: 0
  },
  {
    name: 'Pintuck Detail Silk Shirt',
    description: 'Tailored shirt featuring intricate pintuck details down the front.',
    price: 175.00,
    category: 'shirt',
    material: '100% Silk Twill',
    images: ['https://images.pexels.com/photos/22441317/pexels-photo-22441317.jpeg?cs=srgb&dl=pexels-dayong-tien-681073045-22441317.jpg&fm=jpg'],
    stockQuantity: 30,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Black', 'Cream'],
    featured: 0
  },
 
  // SCARVES
  {
    name: 'Printed Silk Scarf',
    description: 'A 36" square silk twill scarf featuring an exclusive geometric print.',
    price: 65.00,
    category: 'scarf',
    material: '100% Silk Twill',
    images: ['https://images.pexels.com/photos/3844856/pexels-photo-3844856.jpeg?cs=srgb&dl=pexels-nuy-nuy-2192969-3844856.jpg&fm=jpg'],
    stockQuantity: 100,
    sizes: ['One Size'],
    colors: ['Geometric Print', 'Floral Print'],
    featured: 0
  },
  {
    name: 'Classic Skinny Silk Scarf',
    description: 'A versatile skinny scarf to tie around the neck, hair, or handbag.',
    price: 45.00,
    category: 'scarf',
    material: '100% Silk Charmeuse',
    images: ['https://images.pexels.com/photos/36455709/pexels-photo-36455709.jpeg?cs=srgb&dl=pexels-dauphotographer-36455709.jpg&fm=jpg'],
    stockQuantity: 120,
    sizes: ['One Size'],
    colors: ['Leopard', 'Polka Dot', 'Solid Black'],
    featured: 0
  },
  {
    name: 'Oversized Silk Wrap',
    description: 'Generously sized wrap that can be worn as a shawl or oversized scarf.',
    price: 110.00,
    category: 'scarf',
    material: 'Silk Cashmere Blend',
    images: ['https://images.pexels.com/photos/36455711/pexels-photo-36455711.jpeg?cs=srgb&dl=pexels-dauphotographer-36455711.jpg&fm=jpg'],
    stockQuantity: 40,
    sizes: ['One Size'],
    colors: ['Camel', 'Soft Grey', 'Navy'],
    featured: 0
  },
  {
    name: 'Artisan Hand-Dyed Scarf',
    description: 'Each piece is uniquely hand-dyed, making no two scarves exactly alike.',
    price: 85.00,
    category: 'scarf',
    material: '100% Habotai Silk',
    images: ['https://images.pexels.com/photos/36455718/pexels-photo-36455718.jpeg?cs=srgb&dl=pexels-dauphotographer-36455718.jpg&fm=jpg'],
    stockQuantity: 25,
    sizes: ['One Size'],
    colors: ['Ocean Blue', 'Sunset Orange', 'Amethyst'],
    featured: 0
  }
];

function dbQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

// Small helpers for categories and products
const CATEGORY_METADATA = {
  blouse: {
    nameEs: 'blusa',
    descriptionEn: 'Silk blouse collection',
    descriptionEs: 'Coleccion de blusas de seda',
  },
  dress: {
    nameEs: 'vestido',
    descriptionEn: 'Silk dress collection',
    descriptionEs: 'Coleccion de vestidos de seda',
  },
  shirt: {
    nameEs: 'camisa',
    descriptionEn: 'Silk shirt collection',
    descriptionEs: 'Coleccion de camisas de seda',
  },
  scarf: {
    nameEs: 'panuelo',
    descriptionEn: 'Silk scarf collection',
    descriptionEs: 'Coleccion de panuelos de seda',
  },
};

function buildSeedSku(category, indexWithinCategory) {
  const prefix = String(category || 'item')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 4)
    .padEnd(4, 'X');

  return `${prefix}-${String(indexWithinCategory).padStart(3, '0')}`;
}

function distributeSizeStock(sizes, totalStock) {
  if (!Array.isArray(sizes) || sizes.length === 0) {
    return [];
  }

  const safeTotal = Math.max(0, Number(totalStock) || 0);
  const base = Math.floor(safeTotal / sizes.length);
  let remainder = safeTotal % sizes.length;

  return sizes.map((size) => {
    const normalizedSize = String(size || '').trim() || 'One Size';
    const stockQuantity = base + (remainder > 0 ? 1 : 0);

    if (remainder > 0) {
      remainder -= 1;
    }

    return {
      name: normalizedSize,
      stockQuantity,
    };
  });
}

async function ensureCategory(categoryName) {
  const normalizedCategory = String(categoryName || 'other').trim().toLowerCase() || 'other';
  const metadata = CATEGORY_METADATA[normalizedCategory] || {
    nameEs: normalizedCategory,
    descriptionEn: `${normalizedCategory} collection`,
    descriptionEs: `${normalizedCategory} collection`,
  };

  const result = await dbQuery(
    `INSERT INTO categories (
      name_en,
      name_es,
      description_en,
      description_es,
      is_active
    ) VALUES (?, ?, ?, ?, TRUE)
    ON DUPLICATE KEY UPDATE
      category_id = LAST_INSERT_ID(category_id),
      name_es = VALUES(name_es),
      description_en = VALUES(description_en),
      description_es = VALUES(description_es),
      is_active = VALUES(is_active)`,
    [
      normalizedCategory,
      metadata.nameEs,
      metadata.descriptionEn,
      metadata.descriptionEs,
    ]
  );

  return result.insertId;
}

async function ensureDefaultCustomer() {
  const passwordHash = bcrypt.hashSync(SEEDED_CUSTOMER_PASSWORD, 10);

  await dbQuery(
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
    ) VALUES (?, ?, 'CUSTOMER', ?, ?, '', ?, 'EN', TRUE, ?)
    ON DUPLICATE KEY UPDATE
      user_id = LAST_INSERT_ID(user_id),
      password_hash = VALUES(password_hash),
      account_type = VALUES(account_type),
      first_name = VALUES(first_name),
      last_name = VALUES(last_name),
      company_name = VALUES(company_name),
      phone = VALUES(phone),
      preferred_language = VALUES(preferred_language),
      is_active = VALUES(is_active),
      notification_preferences = VALUES(notification_preferences)`,
    [
      SEEDED_CUSTOMER.email,
      passwordHash,
      SEEDED_CUSTOMER.firstName,
      SEEDED_CUSTOMER.lastName,
      SEEDED_CUSTOMER.phone,
      JSON.stringify({ email: true, sms: false }),
    ]
  );
}

async function ensureSeedBrands() {
  const passwordHash = bcrypt.hashSync(SEEDED_BRAND_PASSWORD, 10);
  const brandIdByEmail = new Map();

  for (const brand of SEEDED_BRANDS) {
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
      ) VALUES (?, ?, 'BRAND', ?, ?, ?, ?, 'EN', TRUE, ?)
      ON DUPLICATE KEY UPDATE
        user_id = LAST_INSERT_ID(user_id),
        password_hash = VALUES(password_hash),
        account_type = VALUES(account_type),
        company_name = VALUES(company_name),
        phone = VALUES(phone),
        preferred_language = VALUES(preferred_language),
        is_active = VALUES(is_active),
        notification_preferences = VALUES(notification_preferences)`,
      [
        brand.email,
        passwordHash,
        '',
        '',
        brand.companyName,
        brand.phone,
        JSON.stringify({ email: true, sms: false }),
      ]
    );

    brandIdByEmail.set(brand.email, result.insertId);
  }

  return brandIdByEmail;
}

// Save or update a product in the catalog
async function upsertProduct(product, sku, brandUserId) {
  const categoryId = await ensureCategory(product.category);
  const sizeInventory = distributeSizeStock(product.sizes, product.stockQuantity);

  await dbQuery(
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
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PHYSICAL', ?, NULL, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      category_id = VALUES(category_id),
      brand_user_id = VALUES(brand_user_id),
      name_en = VALUES(name_en),
      name_es = VALUES(name_es),
      description_en = VALUES(description_en),
      description_es = VALUES(description_es),
      image = VALUES(image),
      image_urls = VALUES(image_urls),
      price = VALUES(price),
      stock_quantity = VALUES(stock_quantity),
      product_type = VALUES(product_type),
      material = VALUES(material),
      weight = VALUES(weight),
      is_featured = VALUES(is_featured),
      sizes_json = VALUES(sizes_json),
      colors_json = VALUES(colors_json)`,
    [
      categoryId,
      brandUserId,
      sku,
      product.name,
      product.name,
      product.description,
      product.description,
      product.images[0] || '',
      JSON.stringify(product.images),
      Number(product.price),
      Number(product.stockQuantity || 0),
      product.material,
      product.featured ? 1 : 0,
      JSON.stringify(sizeInventory),
      JSON.stringify(product.colors || []),
    ]
  );
}

// Main seed runner
async function seedProducts() {
  await ensureDefaultCustomer();
  const brandIdByEmail = await ensureSeedBrands();
  const categoryCounters = new Map();

  console.log('Seeding products into normalized schema...');

  for (const [index, product] of initialProducts.entries()) {
    const categoryCount = (categoryCounters.get(product.category) || 0) + 1;
    categoryCounters.set(product.category, categoryCount);

    const sku = buildSeedSku(product.category, categoryCount);
    const brand = SEEDED_BRANDS[index % SEEDED_BRANDS.length];
    const brandUserId = brandIdByEmail.get(brand.email);

    await upsertProduct(product, sku, brandUserId);
  }

  console.log('Products seeded successfully.');
  console.log('Seeded customer:');
  console.log(`- ${SEEDED_CUSTOMER.firstName} ${SEEDED_CUSTOMER.lastName} (${SEEDED_CUSTOMER.email}) / ${SEEDED_CUSTOMER_PASSWORD}`);
  console.log('Seeded brands:');
  SEEDED_BRANDS.forEach((brand) => {
    console.log(`- ${brand.companyName} (${brand.email}) / ${SEEDED_BRAND_PASSWORD}`);
  });
}

seedProducts()
  .catch((error) => {
    console.error('Failed to seed products:', error);
    process.exitCode = 1;
  })
  .finally(() => {
    db.end();
  });
