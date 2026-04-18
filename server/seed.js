const db = require('./config/db');

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
    colors: ['White', 'Navy', 'Burgundy']
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
    colors: ['Black', 'Rose', 'Silver']
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
    colors: ['Blush', 'Ivory']
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
    colors: ['Emerald', 'Midnight Blue']
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
    colors: ['Black', 'Emerald', 'Champagne']
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
    colors: ['Ruby', 'Sapphire', 'Pearl']
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
    colors: ['Navy', 'Plum']
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
    colors: ['Crimson', 'Gold', 'Black']
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
    colors: ['Ivory', 'Charcoal', 'Blush']
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
    colors: ['White', 'Light Blue', 'Olive']
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
    colors: ['Sand', 'Navy', 'Rust']
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
    colors: ['Black', 'Cream']
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
    colors: ['Geometric Print', 'Floral Print']
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
    colors: ['Leopard', 'Polka Dot', 'Solid Black']
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
    colors: ['Camel', 'Soft Grey', 'Navy']
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
    colors: ['Ocean Blue', 'Sunset Orange', 'Amethyst']
  }
];

function seedProducts() {
  db.get(`SELECT COUNT(*) as count FROM Products`, [], (err, row) => {
    if (err) {
      console.error(err);
      return;
    }
    
    // Always clear and re-seed for this update
    console.log('Clearing old products and seeding new ones...');
    db.run(`DELETE FROM Products`, (err) => {
      if (err) console.error(err);
      
      const stmt = db.prepare(`INSERT INTO Products (name, description, price, category, material, images, stockQuantity, sizes, colors) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      
      initialProducts.forEach(p => {
        stmt.run([
          p.name, p.description, p.price, p.category, p.material, 
          JSON.stringify(p.images), p.stockQuantity, 
          JSON.stringify(p.sizes), JSON.stringify(p.colors)
        ]);
      });
      
      stmt.finalize();
      console.log('Products seeded successfully.');
    });
  });
}

// Wait a bit for DB to initialize before seeding
setTimeout(seedProducts, 1000);
