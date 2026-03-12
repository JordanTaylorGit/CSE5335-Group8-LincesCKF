import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import products from "../data/products";

function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const categories = ["all", ...new Set(products.map((item) => item.category))];

  const filteredProducts = useMemo(() => {
    let updatedProducts =
      selectedCategory === "all"
        ? [...products]
        : products.filter((item) => item.category === selectedCategory);

    if (sortBy === "low-to-high") {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "high-to-low") {
      updatedProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    return updatedProducts;
  }, [selectedCategory, sortBy]);

  return (
    <main className="min-h-screen bg-[#f6f4f1]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
            New Collection
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-gray-900">
            Product Catalog
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Discover curated fashion essentials.
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm capitalize ${
                  selectedCategory === category
                    ? "bg-black text-white"
                    : "border border-gray-300 bg-white text-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="w-full lg:w-56">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 outline-none"
            >
              <option value="default">Sort By</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default Home;