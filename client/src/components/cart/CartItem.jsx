import { useCart } from "../../context/CartContext";

function CartItem({ item }) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  if (!item) return null;

  return (
    <div className="bg-white border border-[#e8dfd4] p-5 flex flex-col md:flex-row gap-5">
      <img
        src={item.image || "https://via.placeholder.com/300x300?text=Product"}
        alt={item.name || "Product"}
        className="w-full md:w-[180px] h-[220px] md:h-[180px] object-cover"
      />

      <div className="flex-1">
        <p className="text-sm text-[#7b7b7b] lowercase">{item.category || "category"}</p>
        <h3 className="text-2xl text-[#14213d] font-medium mt-1">
          {item.name || "Unnamed Product"}
        </h3>

        <p className="mt-3 text-[#596273]">Size: {item.size || "N/A"}</p>
        <p className="mt-1 text-[#596273]">Color: {item.color || "N/A"}</p>
        <p className="mt-3 text-lg font-semibold text-[#14213d]">
          ${Number(item.price || 0).toFixed(2)}
        </p>

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => decreaseQuantity(item.id, item.size, item.color)}
            className="w-10 h-10 border border-[#111a2f] text-[#111a2f]"
          >
            -
          </button>

          <span className="font-semibold text-[#14213d]">{item.quantity || 1}</span>

          <button
            onClick={() => increaseQuantity(item.id, item.size, item.color)}
            className="w-10 h-10 border border-[#111a2f] text-[#111a2f]"
          >
            +
          </button>
        </div>

        <button
          onClick={() => removeFromCart(item.id, item.size, item.color)}
          className="mt-4 text-red-600 hover:underline"
        >
          Remove
        </button>
      </div>

      <div className="md:text-right">
        <p className="text-sm text-[#7b7b7b]">Subtotal</p>
        <p className="text-xl font-semibold text-[#14213d] mt-1">
          ${(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
        </p>
      </div>
    </div>
  );
}

export default CartItem;