/* Student 1 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useTranslation } from 'react-i18next'

function getSizeName(size) {
  if (typeof size === "string") return size;
  return String(size?.name || size?.size || size?.label || "");
}

function getSizeStock(size) {
  if (!size || typeof size !== "object") return null;
  const stock = Number(size.stockQuantity ?? size.stock ?? size.quantity);
  return Number.isFinite(stock) ? stock : null;
}

function isSizeAvailable(size) {
  const stock = getSizeStock(size);
  return stock === null || stock > 0;
}

function getTotalAvailableStock(product, sizes) {
  const sizeStocks = sizes
    .map(getSizeStock)
    .filter((stock) => stock !== null);

  if (sizeStocks.length > 0) {
    return sizeStocks.reduce((total, stock) => total + stock, 0);
  }

  const stock = Number(product.stockQuantity);
  return Number.isFinite(stock) ? stock : Infinity;
}

function normalizeColorOption(color) {
  if (typeof color === "string") {
    return { name: color, nameEs: color };
  }

  if (!color || typeof color !== "object") {
    return null;
  }

  const name = String(color.name || color.label || "").trim();
  if (!name) return null;

  return {
    ...color,
    name,
    nameEs: String(color.nameEs || color.labelEs || color.name || color.label || "").trim() || name,
  };
}

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t, i18n } = useTranslation();

  const handleViewProduct = () => {
  navigate(`/product/${product.id}`);
  };

  const parseField = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field; // Already an array
    try {
      return JSON.parse(field); // It's a string, so parse it
    } catch (e) {
      return [];
    }
  };

  const parsedColors = parseField(product.colors)
    .map(normalizeColorOption)
    .filter(Boolean);
  const parsedSizes = parseField(product.sizes);
  const parsedImages = parseField(product.images);
  const firstAvailableSize = parsedSizes.find(isSizeAvailable);
  const isOutOfStock = getTotalAvailableStock(product, parsedSizes) <= 0;

  const displayPrice = Number(product.price).toFixed(2);
  const [selectedColor, setSelectedColor] = useState(parsedColors[0] || null);
  const [selectedSize, setSelectedSize] = useState(firstAvailableSize ? getSizeName(firstAvailableSize) : "");

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedColor?.name, selectedSize);
  };

  return (
    <div className="product-card overflow-hidden rounded-[12px] border border-gray-200 bg-white shadow-sm">
      <div className="product-card__media relative">
        <img
          src={parsedImages[0] || ''}
          alt={product.name}
          className={`product-card__image w-full ${isOutOfStock ? "opacity-60" : ""}`}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/55">
            <span className="rounded bg-slate-900/75 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white">
              {t('product.out_of_stock')}
            </span>
          </div>
        )}
      </div>

      <div className="product-card__body p-3">
        <p className="product-card__category capitalize text-gray-500">
          {t({ blouse: 'catalog.blouses', dress: 'catalog.dresses', shirt: 'catalog.shirts', 
          scarf: 'catalog.scarves', skirt: 'catalog.skirt', robe: 'catalog.robe' }[product.category] || product.category)}
        </p>

        {product.brandName && (
          <p className="product-card__brand mt-1 text-sm text-slate-600">
            {t('product.brand')}: {product.brandName}
          </p>
        )}

        <h3 className="product-card__title mt-1 font-medium text-slate-900 line-clamp-2">
          {product.name}
        </h3>

        <p className="product-card__price mt-1 font-semibold text-slate-900">
          ${displayPrice}
        </p>

        <div className="product-card__section mt-2">
          <p className="product-card__label mb-1 font-medium text-slate-700">{t('product.color')}</p>
          <div className="flex flex-wrap gap-1">
            {parsedColors.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`product-card__option inline-flex cursor-pointer items-center gap-1 rounded-md border px-1.5 py-1 transition active:scale-95 ${
                  selectedColor?.name === color.name
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-gray-300 bg-white text-slate-700 hover:border-slate-400"
                }`}
                title={i18n.language === "es" ? color.nameEs : color.name}
                aria-pressed={selectedColor?.name === color.name}
              >
                <span>{i18n.language === "es" ? color.nameEs : color.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="product-card__section mt-2">
          <p className="product-card__label mb-1 font-medium text-slate-700">{t('product.size')}</p>
          <div className="flex flex-wrap gap-1">
            {parsedSizes.map((size) => {
              const sizeName = getSizeName(size);
              const sizeStock = getSizeStock(size);
              const disabled = sizeStock !== null && sizeStock <= 0;

              return (
                <button
                  key={sizeName}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelectedSize(sizeName)}
                  className={`product-card__option cursor-pointer rounded border px-2 py-[2px] font-medium transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${
                    selectedSize === sizeName
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-gray-300 bg-white text-slate-700 hover:border-slate-400"
                  }`}
                  aria-pressed={selectedSize === sizeName}
                  title={sizeStock !== null ? t('product.size_stock_title', { count: sizeStock }) : sizeName}
                >
                  {sizeName}
                  {sizeStock !== null ? ` (${sizeStock})` : ""}
                </button>
              );
            })}
          </div>
        </div>

        <div className="product-card__actions mt-3 flex gap-2">
          <button
            type="button"
            onClick={handleViewProduct}
            className="product-card__action-btn flex-1 cursor-pointer rounded border border-slate-900 px-2 py-2 font-medium text-slate-900 transition hover:bg-slate-900 hover:text-white active:scale-95 active:shadow-inner"
          >
            {t('product.view')}
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="product-card__action-btn flex-1 cursor-pointer rounded bg-slate-900 px-2 py-2 font-medium text-white transition hover:bg-slate-800 active:scale-95 active:shadow-inner disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isOutOfStock ? t('product.out_of_stock') : t('product.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
