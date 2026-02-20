import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@context/CartContext';
import { useLanguage } from '@context/LanguageContext';

export default function Cart() {
  const { t } = useTranslation();
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const { language } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <ShoppingBag size={48} className="text-silk-200 mb-6" strokeWidth={1} />
        <h2 className="font-display text-3xl text-obsidian mb-4">{t('cart.empty')}</h2>
        <Link to="/catalog" className="btn-primary mt-2">{t('cart.continue')}</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="font-display text-4xl md:text-5xl text-obsidian mb-12">{t('cart.title')}</h1>

      <div className="space-y-6 mb-10">
        {items.map(item => {
          const name = language === 'es' ? item.product.nameEs : item.product.nameEn;
          return (
            <div key={item.key} className="flex gap-5 pb-6 border-b border-silk-100">
              <img
                src={item.product.images?.[0] || '/images/placeholder.jpg'}
                alt={name}
                className="w-24 h-32 object-cover bg-ivory-warm flex-shrink-0"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl text-obsidian">{name}</h3>
                  {item.selectedSize && (
                    <p className="text-xs text-obsidian/40 font-body mt-1 tracking-wide">Size: {item.selectedSize}</p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-obsidian/20">
                    <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="w-8 h-8 hover:bg-ivory-warm text-sm">−</button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="w-8 h-8 hover:bg-ivory-warm text-sm">+</button>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-display text-lg">
                      ${(item.product.price * item.quantity).toLocaleString()}
                    </p>
                    <button onClick={() => removeItem(item.key)} className="text-obsidian/30 hover:text-red-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="flex flex-col items-end gap-4">
        <div className="text-right">
          <p className="font-body text-sm text-obsidian/50 uppercase tracking-widest mb-1">{t('cart.subtotal')}</p>
          <p className="font-display text-3xl text-obsidian">${total.toLocaleString()} USD</p>
        </div>
        <div className="flex gap-3 flex-wrap justify-end">
          <Link to="/catalog" className="btn-outline text-sm py-2.5">{t('cart.continue')}</Link>
          <Link to="/checkout" className="btn-primary text-sm py-2.5">{t('cart.checkout')}</Link>
        </div>
      </div>
    </div>
  );
}
