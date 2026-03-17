import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function CartSummary() {
  const { cartItems, cartTotal } = useCart();

  return (
    <div className="bg-white rounded-xl shadow-md p-6 h-fit">
      <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Items</span>
          <span>{cartItems.length}</span>
        </div>

        <div className="flex justify-between font-semibold text-lg border-t pt-3">
          <span>Total</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
      </div>

      <Link
        to="/checkout"
        className={`mt-5 block w-full text-center rounded-lg px-4 py-3 font-medium transition ${
          cartItems.length === 0
            ? "bg-gray-300 text-gray-500 pointer-events-none"
            : "bg-black text-white hover:opacity-90"
        }`}
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}

export default CartSummary;