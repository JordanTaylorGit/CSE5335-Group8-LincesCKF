export const CATEGORIES = ['blouse', 'dress', 'shirt', 'accessory', 'skirt', 'robe'];

const products = [
  {
    id: 1,
    name: "Classic Silk Blouse",
    price: 189,
    category: "blouse",
    type: "Women",
    image: "/images/silkBlouse.jpeg",
    description: "Elegant silk blouse with timeless tailoring and luxury texture.",
    colors: ["#edead7", "#f0b7c2", "#1017a7"],
    sizes: ["XS", "S", "M", "L", "XL"],
    featured: true,    
  },
  {
    id: 2,
    name: "Evening Silk Dress",
    price: 349,
    category: "dress",
    type: "Women",
    image: "/images/silkDress.jpeg",
    description: "Refined evening silk dress created for graceful premium occasions.",
    colors: ["#000000", "#a0002c", "#ede8b3"],
    sizes: ["XS", "S", "M", "L", "XL"],
    featured: true,    
  },
  {
    id: 3,
    name: "Luxury Silk Scarf",
    price: 89,
    category: "scarf",
    type: "Accessories",
    image: "/images/silkScarf.jpeg",
    description: "Soft and luxurious silk scarf with premium drape and finish.",
    colors: ["#edead7", "#f0b7c2", "#1017a7", "#a0002c"],
    sizes: ["XS", "S", "M", "L", "XL"],
    featured: true,    
  },
  {
    id: 4,
    name: "Men's Silk Shirt",
    price: 229,
    category: "shirt",
    type: "Men",
    image: "/images/silkShirt.jpeg",
    description: "Luxury silk shirt crafted for sophisticated everyday wear.",
    colors: ["#ede8b3", "#1017a7", "#000000"],
    sizes: ["XS", "S", "M", "L", "XL"],
    featured: false,    
  }
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
  return products.find(p => p.id === String(id)) || null;
}