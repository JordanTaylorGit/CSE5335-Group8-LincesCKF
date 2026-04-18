const bcrypt = require('bcryptjs');
const db = require('./config/db');

const SEEDED_BRAND_PASSWORD = 'BrandSeed123!';
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

async function ensureSeedBrands() {
  const passwordHash = bcrypt.hashSync(SEEDED_BRAND_PASSWORD, 10);
  const brandIds = [];

  for (const brand of SEEDED_BRANDS) {
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
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        id = LAST_INSERT_ID(id),
        accountType = 'BRAND',
        companyName = ?,
        phone = ?,
        passwordHash = ?`,
      [
        '',
        '',
        brand.email,
        passwordHash,
        brand.phone,
        'BRAND',
        brand.companyName,
        JSON.stringify([]),
        JSON.stringify({ email: true, sms: false }),
        brand.companyName,
        brand.phone,
        passwordHash,
      ]
    );

    brandIds.push(result.insertId);
  }

  return brandIds;
}

async function seedProducts() {
  const brandIds = await ensureSeedBrands();

  console.log('Clearing old products and seeding new ones...');
  await dbQuery(`DELETE FROM Products`);

  for (const [index, product] of initialProducts.entries()) {
    await dbQuery(
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
        featured,
        brandId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product.name,
        product.description,
        product.price,
        product.category,
        product.material,
        JSON.stringify(product.images),
        product.stockQuantity,
        JSON.stringify(product.sizes),
        JSON.stringify(product.colors),
        product.featured || 0,
        brandIds[index % brandIds.length],
      ]
    );
  }

  console.log('Products seeded successfully.');
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
