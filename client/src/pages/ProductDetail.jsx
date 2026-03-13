import { useMemo, useState } from "react";
import ProductCard from "../components/shared/ProductCard";
import CatalogFilters from "../components/catalog/CatalogFilters";

const products = [
  {
    id: 1,
    name: "Classic Silk Blouse",
    price: 189,
    category: "blouse",
    type: "Women",
    image: "/images/blouse1.jpg",
    description: "Elegant silk blouse with timeless tailoring and luxury texture.",
    colors: ["#edead7", "#f0b7c2", "#1017a7"]
  },
  {
    id: 2,
    name: "Evening Silk Dress",
    price: 349,
    category: "dress",
    type: "Women",
    image: "/images/dress1.jpg",
    description: "Refined evening silk dress created for graceful premium occasions.",
    colors: ["#000000", "#a0002c", "#ede8b3"]
  },
  {
    id: 3,
    name: "Luxury Silk Scarf",
    price: 89,
    category: "scarf",
    type: "Accessories",
    image: "/images/scarf1.jpg",
    description: "Soft and luxurious silk scarf with premium drape and finish.",
    colors: ["#edead7", "#f0b7c2", "#1017a7", "#a0002c"]
  },
  {
    id: 4,
    name: "Men's Silk Shirt",
    price: 229,
    category: "shirt",
    type: "Men",
    image: "/images/shirt1.jpg",
    description: "Luxury silk shirt crafted for sophisticated everyday wear.",
    colors: ["#ede8b3", "#1017a7", "#000000"]
  }
];

function Catalog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  const filteredProducts = useMemo(() => {
    let data = [...products];

    if (category !== "All") {
      data = data.filter((product) => product.category === category);
    }

    if (search.trim()) {
      data = data.filter((product) =>
        `${product.name} ${product.category} ${product.type}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (sort === "price-low-high") {
      data.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high-low") {
      data.sort((a, b) => b.price - a.price);
    }

    if (sort === "name-a-z") {
      data.sort((a, b) => a.name.localeCompare(b.name));
    }

    return data;
  }, [search, category, sort]);

  return (
    <div className="bg-[#f2f2f2] min-h-screen">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-10 py-14">
        <div className="text-center mb-10">
          <p className="text-[#14213d] text-[18px]">Featured Products</p>
        </div>

        <CatalogFilters
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          sort={sort}
          setSort={setSort}
        />

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-7 mt-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="flex justify-center mt-14">
          <button className="border border-[#111a2f] text-[#111a2f] px-10 py-4 hover:bg-[#111a2f] hover:text-white transition">
            View All Products
          </button>
        </div>
      </div>
    </div>
  );
}

export default Catalog;