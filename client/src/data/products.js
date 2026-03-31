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
    name: "Classic Silk Blouse",
    price: 189,
    category: "blouse",
    type: "Women",
    image: "/images/silkBlouse.jpeg",
    description: "Elegant silk blouse with timeless tailoring and luxury texture.",
    colors: [
      { name: "Cream", value: "#f3eedf" },
      { name: "Pink", value: "#f6b7c1" },
      { name: "Blue", value: "#1826b8" },      
    ],
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
    colors: [
      { name: "Black", value: "#000000" },
      { name: "Maroon", value: "#9d002d" },
      { name: "Gold", value: "#efe7b2" },      
    ],
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
    colors: [
      { name: "Cream", value: "#f3eedf" },
      { name: "Pink", value: "#f6b7c1" },
      { name: "Blue", value: "#1826b8" },
      { name: "Red", value: "#9d002d" },      
    ],
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
    colors: [
      { name: "Gold", value: "#d7c27b" },
      { name: "White", value: "#ffffff" },
      { name: "Black", value: "#111827" },
    ],
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