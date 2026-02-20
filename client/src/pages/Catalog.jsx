import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SlidersHorizontal } from 'lucide-react';
import ProductCard from '@components/shared/ProductCard';
import { getProducts, CATEGORIES } from '@utils/products';

const SORT_OPTIONS = [
  { value: 'default', labelKey: 'Default' },
  { value: 'price-asc', labelKey: 'Price: Low → High' },
  { value: 'price-desc', labelKey: 'Price: High → Low' },
];

export default function Catalog() {
  const { t } = useTranslation();
  const { category: paramCategory } = useParams();
  const [activeCategory, setActiveCategory] = useState(paramCategory || 'all');
  const [sort, setSort] = useState('default');

  const rawProducts = activeCategory === 'all' ? getProducts() : getProducts(activeCategory);

  const products = [...rawProducts].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="font-display text-5xl md:text-6xl text-obsidian">{t('catalog.title')}</h1>
        <div className="divider-silk w-24 mx-auto mt-6" />
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <FilterBtn
            active={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
          >
            {t('catalog.categories.all')}
          </FilterBtn>
          {CATEGORIES.map(cat => (
            <FilterBtn
              key={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            >
              {t(`catalog.categories.${cat}`)}
            </FilterBtn>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 text-sm text-obsidian/60">
          <SlidersHorizontal size={14} />
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="bg-transparent font-body text-sm border-b border-silk-300 focus:outline-none focus:border-silk-600 pb-0.5 cursor-pointer"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.labelKey}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <p className="text-center text-obsidian/40 py-24 font-display text-2xl">
          {t('catalog.no_results')}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`font-accent text-xs px-5 py-2 tracking-widest uppercase border transition-all duration-200 ${
        active
          ? 'bg-obsidian text-ivory border-obsidian'
          : 'bg-transparent text-obsidian border-obsidian/20 hover:border-obsidian'
      }`}
    >
      {children}
    </button>
  );
}
