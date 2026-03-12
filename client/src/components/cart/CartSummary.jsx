function CartSummary({ cartItems }) {
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Summary</h2>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-700">
        <span>Items</span>
        <span>{cartItems.length}</span>
      </div>

      <div className="mt-2 flex items-center justify-between text-sm text-gray-700">
        <span>Total</span>
        <span>${total}</span>
      </div>

      <button className="mt-5 w-full rounded-2xl bg-black px-4 py-3 text-sm text-white hover:opacity-90">
        Checkout
      </button>
    </div>
  );
}

export default CartSummary;