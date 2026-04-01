/* Student 1 - Velupula, Lakshmi - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import { useMemo, useState } from "react";
import ProductCard from "../components/shared/ProductCard";
import products from "../data/products";

function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState("All Products");

  const categories = ["All Products", ...new Set(products.map((p) => p.category))];

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All Products") {
      return products;
    }
    return products.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ marginBottom: "10px" }}>Product Catalog</h1>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                cursor: "pointer",
                backgroundColor:
                  selectedCategory === category ? "#111827" : "#ffffff",
                color: selectedCategory === category ? "#ffffff" : "#111827",
                fontWeight: 500,
              }}
            >
              {category}
            </button>
          ))}
        </div>

        <p style={{ color: "#6b7280" }}>
          Showing: <strong>{selectedCategory}</strong>
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "20px",
        }}
      >
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && <p>No products found.</p>}
    </div>
  );
}

export default Catalog;