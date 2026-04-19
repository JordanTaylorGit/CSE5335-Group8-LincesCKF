/* Student 1 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTranslation } from 'react-i18next';
import { fetchWithAuth } from "../services/api";

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

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { t, i18n } = useTranslation();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");

  const parseField = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
      return JSON.parse(field);
    } catch {
      return [];
    }
  };

  useEffect(() => {
    fetchWithAuth(`/products/${id}`)
      .then(data => {
        setProduct(data);
        const parsedColors = parseField(data.colors)
          .map(normalizeColorOption)
          .filter(Boolean);
        const parsedSizes = parseField(data.sizes);
        const firstAvailableSize = parsedSizes.find(isSizeAvailable);

        if (parsedColors.length > 0) setSelectedColor(parsedColors[0]);
        if (firstAvailableSize) setSelectedSize(getSizeName(firstAvailableSize));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const productName = product?.name;
  const productDesc = product?.description;

  if (loading) {
    return <div className="p-10 text-lg">{t('common.loading')}</div>;
  }

  if (!product) {
    return <div className="p-10 text-lg">{t('product.productNotFound')}</div>;
  }

  const parsedImages = parseField(product.images);
  const imageUrl = parsedImages[0] || '';
  const parsedColors = parseField(product.colors)
    .map(normalizeColorOption)
    .filter(Boolean);
  const parsedSizes = parseField(product.sizes);
  const displayPrice = Number(product.price).toFixed(2);
  const isOutOfStock = getTotalAvailableStock(product, parsedSizes) <= 0;

  return (
    <div className="product-detail-page min-h-screen bg-[#f5f5f5] py-10">

      <div className="product-detail-page__layout mx-auto grid max-w-[1400px] gap-10 px-8 lg:grid-cols-2">
        <div className="product-detail-page__media relative overflow-hidden rounded-[18px] bg-white shadow-sm">
          <img
            src={imageUrl}
            alt={product.name}
            className={`product-detail-page__image h-[520px] w-full object-cover ${isOutOfStock ? "opacity-60" : ""}`}
          />
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/55">
              <span className="rounded bg-slate-900/75 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white">
                {t('product.out_of_stock')}
              </span>
            </div>
          )}
        </div>

        <div className="product-detail-page__content rounded-[18px] bg-white p-8 shadow-sm">
          <p className="text-sm capitalize text-gray-500">{t({ blouse: 'catalog.blouses', 
            dress: 'catalog.dresses', shirt: 'catalog.shirts', scarf: 'catalog.scarves', 
            skirt: 'catalog.skirt', robe: 'catalog.robe' }[product.category] || product.category)}
          </p>

          <h1 className="mt-2 text-[32px] font-semibold text-slate-900">
            {productName}
          </h1>

          {product.brandName && (
            <p className="mt-3 text-[16px] text-slate-600">
              <span className="font-medium text-slate-800">{t('product.brand')}:</span> {product.brandName}
            </p>
          )}

          <p className="mt-4 text-[28px] font-bold text-slate-900">
            ${displayPrice}
          </p>

          <p className="mt-6 text-[16px] leading-7 text-slate-600">
            {productDesc}
          </p>

          <div className="mt-8">
            <h3 className="mb-3 text-[18px] font-medium text-slate-900">
              {t('product.color')}
            </h3>

            <div className="flex flex-wrap gap-3">
              {parsedColors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition active:scale-95 ${
                    selectedColor?.name === color.name
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-gray-300 bg-white text-slate-700 hover:border-slate-400"
                  }`}
                  aria-pressed={selectedColor?.name === color.name}
                >
                  <span>{i18n.language === "es" ? color.nameEs : color.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="mb-3 text-[18px] font-medium text-slate-900">
              {t('product.size')}
            </h3>

            <div className="flex flex-wrap gap-3">
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
                    className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${
                      selectedSize === sizeName
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-gray-300 bg-white text-slate-700 hover:border-slate-400"
                    }`}
                    aria-pressed={selectedSize === sizeName}
                    title={sizeStock !== null ? t('product.size_stock_title', { count: sizeStock }) : sizeName}
                  >
                    {sizeName}
                    {sizeStock !== null ? ` (${t('product.size_stock_left', { count: sizeStock })})` : ""}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => addToCart(product, selectedColor?.name, selectedSize)}
            disabled={isOutOfStock}
            className="product-detail-page__cta mt-10 cursor-pointer rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-95 active:shadow-inner disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isOutOfStock ? t('product.out_of_stock') : t('product.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
