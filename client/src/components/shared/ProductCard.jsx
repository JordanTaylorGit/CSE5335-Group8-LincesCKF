import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@context/CartContext';
import { useLanguage } from '@context/LanguageContext';

export default function ProductCard({ product }) {
  const { t } = useTranslation();
  const { addItem } = useCart();
  const { language } = useLanguage();

  const name = language === 'es' ? product.nameEs : product.nameEn;
  const image = product.images?.[0] || '/images/placeholder.jpg';

  const handleQuickAdd = (e) => {
    e.preventDefault();
    addItem(product, 1, product.sizes?.[0], product.colors?.[0]);
  };

  return (
    <article className="card-product group">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-[3/4]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/10 transition-all duration-300 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100">
          <button
            onClick={handleQuickAdd}
            className="btn-primary text-xs py-2 px-6 flex items-center gap-2"
          >
            <ShoppingBag size={14} />
            {t('catalog.add_to_cart')}
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="font-body text-xs text-silk-500 uppercase tracking-widest mb-1">
          {t(`catalog.categories.${product.category}`)}
        </p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-lg text-obsidian hover:text-silk-600 transition-colors leading-tight">
            {name}
          </h3>
        </Link>
        <p className="font-body text-sm text-obsidian/60 mt-2">
          ${product.price.toLocaleString()} {product.currency}
        </p>
      </div>
    </article>
  );
}
