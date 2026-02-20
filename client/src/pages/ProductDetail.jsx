import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { getProductById } from '@utils/products';
import { useCart } from '@context/CartContext';
import { useLanguage } from '@context/LanguageContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const product = getProductById(id);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-obsidian/40 font-display text-2xl">
        Product not found.
      </div>
    );
  }

  const name = language === 'es' ? product.nameEs : product.nameEn;
  const description = language === 'es' ? product.descriptionEs : product.descriptionEn;

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-obsidian/50 hover:text-obsidian transition-colors mb-10"
      >
        <ArrowLeft size={14} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Image */}
        <div className="aspect-[3/4] bg-ivory-warm overflow-hidden">
          <img
            src={product.images?.[0] || '/images/placeholder.jpg'}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          <p className="font-accent text-silk-500 text-xs tracking-[0.4em] uppercase mb-3">
            {t(`catalog.categories.${product.category}`)}
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-obsidian mb-4">{name}</h1>
          <p className="font-display text-2xl text-silk-600 mb-6">
            ${product.price.toLocaleString()} <span className="text-sm text-obsidian/40">{product.currency}</span>
          </p>

          <div className="divider-silk mb-6" />

          <p className="font-body text-obsidian/70 leading-relaxed mb-8">{description}</p>

          {/* Color Selection */}
          {product.colors?.length > 0 && (
            <div className="mb-6">
              <p className="font-body text-xs uppercase tracking-widest text-obsidian/60 mb-3">
                {t('product.color')}
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 text-xs font-accent uppercase tracking-wider border transition-all ${
                      selectedColor === color
                        ? 'bg-obsidian text-ivory border-obsidian'
                        : 'border-obsidian/20 hover:border-obsidian'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes?.length > 0 && (
            <div className="mb-8">
              <p className="font-body text-xs uppercase tracking-widest text-obsidian/60 mb-3">
                {t('product.size_guide')}
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-10 text-xs font-accent border transition-all ${
                      selectedSize === size
                        ? 'bg-obsidian text-ivory border-obsidian'
                        : 'border-obsidian/20 hover:border-obsidian'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add to Cart */}
          <div className="flex items-stretch gap-3">
            <div className="flex items-center border border-obsidian/20">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-12 hover:bg-ivory-warm transition-colors text-obsidian">−</button>
              <span className="w-10 text-center font-body text-sm">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-12 hover:bg-ivory-warm transition-colors text-obsidian">+</button>
            </div>
            <button
              onClick={handleAddToCart}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} />
              {added ? '✓ Added!' : t('product.add_to_cart')}
            </button>
          </div>

          {/* Material */}
          <p className="text-xs text-obsidian/40 font-body mt-6 tracking-wide">
            {t('product.material')}: {product.material}
          </p>
        </div>
      </div>
    </div>
  );
}
