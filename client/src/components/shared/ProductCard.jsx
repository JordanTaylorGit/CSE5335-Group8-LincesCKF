/* Student 1 - Velupula, Lakshmi - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white border border-[#e8dfd4] shadow-sm hover:shadow-md transition rounded-sm overflow-hidden">
      <div className="bg-[#f2f2f2]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[360px] object-cover"
        />
      </div>

      <div className="px-5 py-4">
        <p className="text-[15px] text-[#7d7d7d] lowercase">{product.category}</p>

        <h3 className="text-[22px] text-[#14213d] mt-2 font-medium">
          {product.name}
        </h3>

        <p className="text-[16px] text-[#14213d] mt-4 font-semibold">
          ${product.price.toFixed(2)}
        </p>

        <div className="flex items-center gap-2 mt-4">
          {product.colors?.map((color, index) => (
            <span
              key={index}
              className="w-7 h-7 rounded-full border border-[#ddd]"
              style={{ backgroundColor: color }}
            ></span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <button
            onClick={() => addToCart(product, { quantity: 1 })}
            className="bg-[#111a2f] text-white py-3 rounded-none hover:bg-[#1b2744] transition"
          >
            Add to Cart
          </button>

          <Link
            to={`/catalog/${product.id}`}
            className="border border-[#111a2f] text-[#111a2f] text-center py-3 hover:bg-[#111a2f] hover:text-white transition"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;