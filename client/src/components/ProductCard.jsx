import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md">
      <div className="w-full h-40 overflow-hidden bg-gray-100 sm:h-48 lg:h-52">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-4">
        <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
          {product.category}
        </p>

        <h2 className="mt-1 text-base font-medium lowercase text-gray-900">
          {product.name}
        </h2>

        <p className="mt-1 text-sm text-gray-600">${product.price}</p>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => navigate(`/product/${product.id}`)}
            className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            View
          </button>

          <button
            onClick={() => addToCart(product)}
            className="flex-1 rounded-xl bg-black px-3 py-2 text-sm text-white hover:opacity-90"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;