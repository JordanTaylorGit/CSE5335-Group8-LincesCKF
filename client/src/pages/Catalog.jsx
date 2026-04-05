/* Student 1 - Taylor, Jordan - ID# - 1002080693
 * Student 2 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 3 - Tran, Andy - ID# - 1002116149
 * Student 4 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ProductCard from "../components/shared/ProductCard";
import products from "../data/products";

function Catalog() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", ...new Set(products.map((p) => p.category))];

  const categoryLabels = {
    all:    'catalog.allCategories',
    blouse: 'catalog.blouses',
    dress:  'catalog.dresses',
    shirt:  'catalog.shirts',
    scarf:  'catalog.scarves',
    skirt:  'catalog.skirt',
    robe:   'catalog.robe',
  };

  const getLabel = (key) => t(categoryLabels[key]) || key;

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") {
      return products;
    }
    return products.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ marginBottom: "10px" }}>{t('catalog.title')}</h1>

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
              {getLabel(category)}
            </button>
          ))}
        </div>

        <p style={{ color: "#6b7280" }}>
          {t('catalog.results', { count: filteredProducts.length })}
        </p>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      >
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && <p>{t('catalog.no_results')}.</p>}
    </div>
  );
}

export default Catalog;