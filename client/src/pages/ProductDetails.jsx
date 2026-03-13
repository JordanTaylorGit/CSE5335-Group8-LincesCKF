import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import products from "../data/products";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart, message } = useCart();

  const product = useMemo(
    () => products.find((item) => item.id === Number(id)),
    [id]
  );

  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "");

  if (!product) {
    return <div className="p-10 text-lg">Product not found</div>;
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] py-10">
      {message && (
        <div className="fixed right-6 top-6 z-50 rounded-lg bg-[#0f172a] px-5 py-3 text-sm font-medium text-white shadow-lg">
          {message}
        </div>
      )}

      <div className="mx-auto grid max-w-[1400px] gap-10 px-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[18px] bg-white shadow-sm">
          <img
            src={product.image}
            alt={product.name}
            className="h-[520px] w-full object-cover"
          />
        </div>

        <div className="rounded-[18px] bg-white p-8 shadow-sm">
          <p className="text-sm capitalize text-gray-500">{product.category}</p>

          <h1 className="mt-2 text-[32px] font-semibold text-slate-900">
            {product.name}
          </h1>

          <p className="mt-4 text-[28px] font-bold text-slate-900">
            ${product.price.toFixed(2)}
          </p>

          <p className="mt-6 text-[16px] leading-7 text-slate-600">
            {product.description}
          </p>

          <div className="mt-8">
            <h3 className="mb-3 text-[18px] font-medium text-slate-900">
              Select Color
            </h3>

            <div className="flex flex-wrap gap-3">
              {product.colors?.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition active:scale-95 ${
                    selectedColor?.name === color.name
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-gray-300 bg-white text-slate-700 hover:border-slate-400"
                  }`}
                >
                  <span
                    className="h-4 w-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.value }}
                  />
                  <span>{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="mb-3 text-[18px] font-medium text-slate-900">
              Select Size
            </h3>

            <div className="flex flex-wrap gap-3">
              {product.sizes?.map((size) => (
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
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;