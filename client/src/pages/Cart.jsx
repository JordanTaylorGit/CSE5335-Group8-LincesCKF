import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import { useCart } from "../context/CartContext";

function Cart() {
  const cartContext = useCart();

  if (!cartContext) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f2f2f2]">
        <div className="bg-white border border-[#e8dfd4] p-8 text-center">
          <h2 className="text-2xl text-[#14213d] font-medium">
            Cart context not found
          </h2>
          <p className="text-[#596273] mt-3">
            Make sure CartProvider is wrapping your app in main.jsx.
          </p>
        </div>
      </div>
    );
  }

  const { cartItems = [] } = cartContext;

  return (
    <div className="bg-[#f2f2f2] min-h-screen">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-10 py-14">
        <div className="text-center mb-10">
          <p className="text-[#14213d] text-[18px]">Shopping Cart</p>
        </div>

        {!Array.isArray(cartItems) || cartItems.length === 0 ? (
          <div className="bg-white border border-[#e8dfd4] p-12 text-center">
            <h2 className="text-3xl text-[#14213d] font-medium">
              Your cart is empty
            </h2>
            <p className="text-[#596273] mt-4">
              Add products from the catalog to continue.
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
            <div className="space-y-5">
              {cartItems.map((item, index) => (
                <CartItem
                  key={`${item.id || "item"}-${item.size || ""}-${item.color || ""}-${index}`}
                  item={item}
                />
              ))}
            </div>

            <CartSummary />
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;