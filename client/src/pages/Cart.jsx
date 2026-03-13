import CartItem from "../components/cart/CartItem";
import { useCart } from "../context/CartContext";

function Cart() {
  const { cartItems, cartTotal, message } = useCart();

  return (
    <main className="min-h-screen bg-[#f5f5f5] py-8">
      {message && (
        <div className="fixed right-6 top-6 z-50 rounded-lg bg-[#0f172a] px-5 py-3 text-sm font-medium text-white shadow-lg">
          {message}
        </div>
      )}

      <div className="mx-auto max-w-[1400px] px-8">
        <h1 className="mb-8 text-[28px] font-semibold text-slate-900">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-[18px] text-slate-500 shadow-sm">
            Your cart is empty
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                  item={item}
                />
              ))}
            </div>

            <div className="h-fit rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-[20px] font-semibold text-slate-900">
                Order Summary
              </h2>

              <div className="mt-6 flex items-center justify-between text-[16px] text-slate-600">
                <span>Total</span>
                <span className="text-[20px] font-bold text-slate-900">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Cart;