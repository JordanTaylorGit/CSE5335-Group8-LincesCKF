const db = require('./config/db');

const initialProducts = [
  // BLOUSES
  {
    name: 'Classic Silk Blouse',
    description: 'Elegant 100% pure silk blouse with a tailored fit, perfect for professional or evening wear.',
    price: 120.00,
    category: 'blouse',
    material: '100% Silk',
    images: ['https://images.unsplash.com/photo-1564257631407-4deb1f99d992?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
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
    images: ['https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
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
    images: ['https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
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
    images: ['https://images.unsplash.com/photo-1551163943-3f6a855d1153?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
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
    images: ['https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
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
    images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
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
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
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
    images: ['https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
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
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
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
    images: ['https://images.unsplash.com/photo-1598554747436-c9293d6a588f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
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
    images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
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
    images: ['https://images.unsplash.com/photo-1589310621855-d9e6571ab42d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
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
    images: ['https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
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
    images: ['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
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
    images: ['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
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
    images: ['https://images.unsplash.com/photo-1601409000833-a44cc9ea43e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
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
