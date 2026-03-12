import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import { useCart } from "../context/CartContext";

function Cart() {
  const { cartItems } = useCart();

  return (
    <main className="min-h-screen bg-[#f6f4f1]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-semibold text-gray-900">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-sm text-gray-600 shadow-sm">
            Your cart is empty.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <CartSummary cartItems={cartItems} />
          </div>
        )}
      </div>
    </main>
  );
}

export default Cart;