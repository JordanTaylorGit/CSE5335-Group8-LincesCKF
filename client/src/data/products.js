/* Student 1 - Velupula, Lakshmi - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

export const CATEGORIES = ['blouse', 'dress', 'shirt', 'accessory', 'skirt', 'robe'];

const products = [
  {
    id: 1,
    nameEn: 'Classic Silk Blouse',
    nameEs: 'Blusa de Seda Clásica',
    name:   'Classic Silk Blouse',        // fallback for components using product.name
    category: 'blouse',
    type: 'Women',
    price: 189,
    currency: 'USD',
    material: '100% Mulberry Silk',
    image: '/images/silkBlouse.jpeg',
    images: ['/images/silkBlouse.jpeg'],
    colors: [
      { name: 'Cream', value: '#f3eedf' },
      { name: 'Pink',  value: '#f6b7c1' },
      { name: 'Blue',  value: '#1826b8' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    descriptionEn: 'Timeless elegance meets modern sophistication in this luxurious silk blouse. Crafted from 100% premium mulberry silk.',
    descriptionEs: 'Elegancia atemporal en esta lujosa blusa de seda mulberry 100% pura.',
    description:   'Timeless elegance meets modern sophistication in this luxurious silk blouse. Crafted from 100% premium mulberry silk.',
    featured: true,
  },
  {
    id: 2,
    nameEn: 'Evening Silk Dress',
    nameEs: 'Vestido de Seda de Noche',
    name:   'Evening Silk Dress',
    category: 'dress',
    type: 'Women',
    price: 349,
    currency: 'USD',
    material: '100% Mulberry Silk',
    image: '/images/silkDress.jpeg',
    images: ['/images/silkDress.jpeg'],
    colors: [
      { name: 'Black',  value: '#000000' },
      { name: 'Maroon', value: '#9d002d' },
      { name: 'Gold',   value: '#efe7b2' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    descriptionEn: 'An exquisite evening dress that flows with graceful movement, made from the finest mulberry silk.',
    descriptionEs: 'Un exquisito vestido de noche que fluye con movimiento elegante.',
    description:   'An exquisite evening dress that flows with graceful movement, made from the finest mulberry silk.',
    featured: true,
  },
  {
    id: 3,
    nameEn: 'Luxury Silk Scarf',
    nameEs: 'Pañuelo de Seda de Lujo',
    name:   'Luxury Silk Scarf',
    category: 'scarf',
    type: 'Accessories',
    price: 89,
    currency: 'USD',
    material: '100% Mulberry Silk',
    image: '/images/silkScarf.jpeg',
    images: ['/images/silkScarf.jpeg'],
    colors: [
      { name: 'Cream', value: '#f3eedf' },
      { name: 'Pink',  value: '#f6b7c1' },
      { name: 'Blue',  value: '#1826b8' },
      { name: 'Red',   value: '#9d002d' },
    ],
    sizes: ['One Size'],
    descriptionEn: 'A versatile accessory crafted from premium silk, adding elegance to any outfit.',
    descriptionEs: 'Un accesorio versátil de seda premium que añade elegancia a cualquier atuendo.',
    description:   'A versatile accessory crafted from premium silk, adding elegance to any outfit.',
    featured: true,
  },
  {
    id: 4,
    nameEn: "Men's Silk Shirt",
    nameEs: 'Camisa de Seda para Hombre',
    name:   "Men's Silk Shirt",
    category: 'shirt',
    type: 'Men',
    price: 229,
    currency: 'USD',
    material: '100% Mulberry Silk',
    image: '/images/silkShirt.jpeg',
    images: ['/images/silkShirt.jpeg'],
    colors: [
      { name: 'Gold',  value: '#d7c27b' },
      { name: 'White', value: '#ffffff' },
      { name: 'Black', value: '#111827' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    descriptionEn: 'Refined and sophisticated, this silk shirt is perfect for any occasion.',
    descriptionEs: 'Refinada y sofisticada, esta camisa de seda es perfecta para cualquier ocasión.',
    description:   'Refined and sophisticated, this silk shirt is perfect for any occasion.',
    featured: false,
  },
];
 
export default products;
 
export function getProducts(category) {
  if (!category || category === 'all') return products;
  return products.filter(p => p.category === category);
}
 
export function getFeaturedProducts() {
  return products.filter(p => p.featured);
}
 
export function getProductById(id) {
  return products.find(p => p.id === Number(id)) || null;
}