/* Student 1 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ProductCard from "../components/shared/ProductCard";
import { fetchWithAuth } from "../services/api";

function getColumnCount(width) {
  if (width <= 768) return 1;
  if (width <= 900) return 2;
  if (width < 1280) return 3;
  return 4;
}

function Catalog() {
  const { t } = useTranslation();
  const [columnCount, setColumnCount] = useState(() =>
    typeof window === "undefined" ? 4 : getColumnCount(window.innerWidth)
  );
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(() =>
    typeof window === "undefined" ? 4 : getColumnCount(window.innerWidth)
  );

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setVisibleCount(columnCount);
  };

  useEffect(() => {
    fetchWithAuth('/products')
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  useEffect(() => {
    const handleResize = () => setColumnCount(getColumnCount(window.innerWidth));

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


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
  }, [selectedCategory, products]);

  useEffect(() => {
    setVisibleCount((prev) => {
      const minimum = Math.min(filteredProducts.length, columnCount);

      if (prev <= 0) return minimum;
      if (prev >= filteredProducts.length) return filteredProducts.length;

      return Math.min(
        filteredProducts.length,
        Math.max(minimum, Math.ceil(prev / columnCount) * columnCount)
      );
    });
  }, [columnCount, filteredProducts.length]);

  const handleLoadMore = () => {
    setVisibleCount((prev) =>
      Math.min(filteredProducts.length, prev + columnCount)
    );
  };

  return (
    <div className="catalog-page">
      <div className="catalog-page__inner">
        <div className="catalog-page__header" style={{ marginBottom: "24px" }}>
          <h1 style={{
            marginBottom: '10px',
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
            fontWeight: 300,
            color: '#0B2545',
            letterSpacing: '-0.02em',
          }}>
            {t('catalog.title')}
          </h1>

          <div
            className="catalog-page__controls"
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
                type="button"
                onClick={() => handleCategoryChange(category)}
                aria-pressed={selectedCategory === category}
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

        <div className="catalog-page__grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.slice(0, visibleCount).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p style={{ fontFamily: 'Jost, sans-serif', color: 'rgba(11,37,69,0.5)', marginTop: 24 }}>
            {t('catalog.no_results')}
          </p>
        )}

        {visibleCount < filteredProducts.length && (
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <p style={{
              fontFamily: 'Jost, sans-serif',
              fontSize: '0.85rem',
              color: 'rgba(11,37,69,0.45)',
              marginBottom: 14,
            }}>
              {t('catalog.results', { count: filteredProducts.length })}
            </p>
            <button
              type="button"
              onClick={handleLoadMore}
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '0.68rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#ffffff',
                background: '#d4900a',
                border: 'none',
                padding: '13px 36px',
                cursor: 'pointer',
                transition: 'background 0.25s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#0B2545'}
              onMouseLeave={e => e.currentTarget.style.background = '#d4900a'}
            >
              {t('catalog.loadMore')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Catalog;
