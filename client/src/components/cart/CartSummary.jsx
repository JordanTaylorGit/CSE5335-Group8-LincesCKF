/* Student 1 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useTranslation } from "react-i18next";

function CartSummary() {
  const { cartItems, cartTotal } = useCart();
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl shadow-md p-6 h-fit">
      <h2 className="text-xl font-semibold mb-4">{t('cart.orderSummary')}</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>{t('cart.totalItems')}</span>
          <span>{cartItems.length}</span>
        </div>

        <div className="flex justify-between font-semibold text-lg border-t pt-3">
          <span>{t('cart.totalPrice')}</span>
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
        {t('cart.proceedCheckout')}
      </Link>
    </div>
  );
}

export default CartSummary;