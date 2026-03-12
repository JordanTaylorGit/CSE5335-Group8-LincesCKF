import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import products from "../data/products";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    return <div className="p-6 text-lg">Product not found</div>;
  }

  return (
    <main className="min-h-screen bg-[#f6f4f1]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              className="h-[420px] w-full object-cover sm:h-[520px] lg:h-[620px]"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
              {product.category}
            </p>

            <h1 className="mt-2 text-4xl font-semibold lowercase text-gray-900">
              {product.name}
            </h1>

            <p className="mt-4 text-2xl text-gray-700">${product.price}</p>

            <p className="mt-6 text-sm leading-7 text-gray-600">
              {product.description}
            </p>

            <button
              onClick={() => addToCart(product)}
              className="mt-8 w-full rounded-2xl bg-black px-5 py-3 text-white hover:opacity-90 sm:w-fit"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;