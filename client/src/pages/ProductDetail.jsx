/* Student 1 - Velupula, Lakshmi - ID# - 1002216063
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

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { t, i18n } = useTranslation();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    fetchWithAuth(`/products/${id}`)
      .then(data => {
        setProduct(data);
        if (data.colors) {
          try {
            const parsedColors = JSON.parse(data.colors);
            if (parsedColors.length > 0) setSelectedColor({ name: parsedColors[0] });
          } catch(e) {}
        }
        if (data.sizes) {
          try {
            const parsedSizes = JSON.parse(data.sizes);
            if (parsedSizes.length > 0) setSelectedSize(parsedSizes[0]);
          } catch(e) {}
        }
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
    return <div className="p-10 text-lg">Loading...</div>;
  }

  if (!product) {
    return <div className="p-10 text-lg">{t('product.productNotFound')}</div>;
  }

  const parsedImages = product.images ? JSON.parse(product.images) : [];
  const imageUrl = parsedImages[0] || '';
  const parsedColors = product.colors ? JSON.parse(product.colors) : [];
  const parsedSizes = product.sizes ? JSON.parse(product.sizes) : [];

  return (
    <main className="min-h-screen bg-[#f5f5f5] py-10">

      <div className="mx-auto grid max-w-[1400px] gap-10 px-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[18px] bg-white shadow-sm">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-[520px] w-full object-cover"
          />
        </div>

        <div className="rounded-[18px] bg-white p-8 shadow-sm">
          <p className="text-sm capitalize text-gray-500">{t({ blouse: 'catalog.blouses', 
            dress: 'catalog.dresses', shirt: 'catalog.shirts', scarf: 'catalog.scarves', 
            skirt: 'catalog.skirt', robe: 'catalog.robe' }[product.category] || product.category)}
          </p>

          <h1 className="mt-2 text-[32px] font-semibold text-slate-900">
            {productName}
          </h1>

          <p className="mt-4 text-[28px] font-bold text-slate-900">
            ${product.price.toFixed(2)}
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
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor({ name: color })}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition active:scale-95 ${
                    selectedColor?.name === color
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-gray-300 bg-white text-slate-700 hover:border-slate-400"
                  }`}
                >
                  <span>{color}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="mb-3 text-[18px] font-medium text-slate-900">
              {t('product.size')}
            </h3>

            <div className="flex flex-wrap gap-3">
              {parsedSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition active:scale-95 ${
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

          <button
            onClick={() => addToCart(product, selectedColor?.name, selectedSize)}
            className="mt-10 cursor-pointer rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-95 active:shadow-inner"
          >
            {t('product.addToCart')}
          </button>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;