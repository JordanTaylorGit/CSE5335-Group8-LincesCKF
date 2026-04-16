/* Student 1 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";

function Cart() {
  const { cartItems } = useCart();
  const { t } = useTranslation();

  return (
    <div className="bg-[#f2f2f2] min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-[2fr_1fr] gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">{t('product.addToCart')}</h1>

          {cartItems.length === 0 ? (
            <p className="text-gray-500">{t('cart.empty')}</p>
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