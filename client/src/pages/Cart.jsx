import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import { useCart } from "../context/CartContext";

function Cart() {
  const { cartItems } = useCart();

  return (
    <div className="bg-[#f2f2f2] min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-[2fr_1fr] gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        <CartSummary />
      </div>
    </div>
  );
}

export default Cart;