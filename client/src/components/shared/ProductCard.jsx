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

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t, i18n } = useTranslation();

  const handleViewProduct = () => {
  navigate(`/product/${product.id}`);
  };

  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");

  const handleAddToCart = () => {
    addToCart(product, selectedColor?.name, selectedSize);
  };

  return (
    <div className="overflow-hidden rounded-[12px] border border-gray-200 bg-white shadow-sm">
      <img
        src={product.image}
        alt={product.name}
        className="h-[280px] w-full object-contain object-top"
      />

      <div className="p-3">
        <p className="text-[12px] capitalize text-gray-500">
          {t({ blouse: 'catalog.blouses', dress: 'catalog.dresses', shirt: 'catalog.shirts', 
          scarf: 'catalog.scarves', skirt: 'catalog.skirt', robe: 'catalog.robe' }[product.category] || product.category)}
        </p>

        <h3 className="mt-1 text-[14px] font-medium text-slate-900 line-clamp-1">
          {i18n.language === 'es' ? product.nameEs : product.nameEn}
        </h3>

        <p className="mt-1 text-[14px] font-semibold text-slate-900">
          ${product.price.toFixed(2)}
        </p>

        <div className="mt-2">
          <p className="mb-1 text-[11px] font-medium text-slate-700">{t('product.color')}</p>
          <div className="flex flex-wrap gap-1">
            {product.colors?.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`inline-flex cursor-pointer items-center gap-1 rounded-md border px-1.5 py-1 text-[10px] transition active:scale-95 ${
                  selectedColor?.name === color.name
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-gray-300 bg-white text-slate-700 hover:border-slate-400"
                }`}
                title={color.name}
              >
                <span
                  className="h-3 w-3 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.value }}
                />
                <span>{i18n.language === 'es' ? color.nameEs : color.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2">
          <p className="mb-1 text-[11px] font-medium text-slate-700">{t('product.size')}</p>
          <div className="flex flex-wrap gap-1">
            {product.sizes?.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`cursor-pointer rounded border px-2 py-[2px] text-[10px] font-medium transition active:scale-95 ${
                  selectedSize === size
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-gray-300 bg-white text-slate-700 hover:border-slate-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={handleViewProduct}
            className="flex-1 cursor-pointer rounded border border-slate-900 px-2 py-2 text-[11px] font-medium text-slate-900 transition hover:bg-slate-900 hover:text-white active:scale-95 active:shadow-inner"
          >
            {t('product.view')}
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 cursor-pointer rounded bg-slate-900 px-2 py-2 text-[11px] font-medium text-white transition hover:bg-slate-800 active:scale-95 active:shadow-inner"
          >
            {t('product.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;