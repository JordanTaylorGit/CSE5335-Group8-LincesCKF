import { useCart } from "../../context/CartContext";

function CartItem({ item }) {
  const { removeFromCart } = useCart();

  return (
    <div className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm">
      <div className="h-24 w-24 overflow-hidden rounded-xl bg-gray-100">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex-1">
        <h3 className="text-base font-medium lowercase text-gray-900">
          {item.name}
        </h3>
        <p className="mt-1 text-sm text-gray-600">${item.price}</p>
        <p className="mt-1 text-sm text-gray-500">Quantity: {item.quantity}</p>

        <button
          onClick={() => removeFromCart(item.id)}
          className="mt-3 rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default CartItem;