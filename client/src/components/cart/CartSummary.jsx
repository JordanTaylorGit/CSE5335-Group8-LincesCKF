import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function CartSummary() {
  const { cartCount = 0, cartTotal = 0, clearCart } = useCart();

  return (
    <div className="bg-white border border-[#e8dfd4] p-6 sticky top-24">
      <h2 className="text-3xl font-medium text-[#14213d] mb-5">Order Summary</h2>

      <div className="flex justify-between py-3 border-b border-[#eee4d8]">
        <span className="text-[#596273]">Total Items</span>
        <span className="text-[#14213d] font-semibold">{cartCount}</span>
      </div>

      <div className="flex justify-between py-3 border-b border-[#eee4d8]">
        <span className="text-[#596273]">Total Price</span>
        <span className="text-[#14213d] font-semibold">${Number(cartTotal).toFixed(2)}</span>
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <button className="bg-[#111a2f] text-white py-3 hover:bg-[#1b2744] transition">
          Proceed to Checkout
        </button>

        <button
          onClick={clearCart}
          className="border border-red-400 text-red-600 py-3 hover:bg-red-50 transition"
        >
          Clear Cart
        </button>

        <Link
          to="/catalog"
          className="border border-[#111a2f] text-[#111a2f] text-center py-3 hover:bg-[#111a2f] hover:text-white transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default CartSummary;