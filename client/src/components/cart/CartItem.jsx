import { useCart } from "../../context/CartContext";

function CartItem({ item }) {
  const { removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

  return (
    <div className="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-[120px_1fr_auto]">
      <img
        src={item.image}
        alt={item.name}
        className="h-[120px] w-full rounded-lg object-cover md:w-[120px]"
      />

      <div>
        <h3 className="text-[18px] font-medium text-slate-900">{item.name}</h3>
        <p className="mt-1 text-sm text-slate-500">Color: {item.selectedColor}</p>
        <p className="mt-1 text-sm text-slate-500">Size: {item.selectedSize}</p>
        <p className="mt-3 text-[18px] font-semibold text-slate-900">
          ${item.price.toFixed(2)}
        </p>
      </div>

      <div className="flex flex-col items-start gap-3 md:items-end">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              decreaseQuantity(item.id, item.selectedColor, item.selectedSize)
            }
            className="h-9 w-9 rounded-md border border-gray-300 bg-white text-lg font-medium text-slate-700"
          >
            -
          </button>

          <span className="min-w-[32px] text-center text-[16px] font-medium text-slate-900">
            {item.quantity}
          </span>

          <button
            type="button"
            onClick={() =>
              increaseQuantity(item.id, item.selectedColor, item.selectedSize)
            }
            className="h-9 w-9 rounded-md border border-gray-300 bg-white text-lg font-medium text-slate-700"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={() =>
            removeFromCart(item.id, item.selectedColor, item.selectedSize)
          }
          className="rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default CartItem;