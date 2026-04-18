/* Student 1 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useTranslation } from "react-i18next";
import { ArrowRight, ShoppingBag } from "lucide-react";

function CartSummary() {
  const { cartItems, cartTotal } = useCart();
  const { t } = useTranslation();
  const totalItems = cartItems.reduce(
    (count, item) => count + Number(item.quantity || 0),
    0
  );
  const isEmpty = cartItems.length === 0;

  return (
    <aside className="cart-summary bg-white rounded-xl shadow-md p-6 h-fit">
      <div className="cart-summary__intro mb-6">
        <div className="cart-summary__intro-icon" aria-hidden="true">
          <ShoppingBag size={20} strokeWidth={1.8} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            {t('cart.checkoutCtaTitle')}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {t('cart.checkoutCtaText')}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">{t('cart.orderSummary')}</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>{t('cart.totalItems')}</span>
          <span>{totalItems}</span>
        </div>

        <div className="flex justify-between font-semibold text-lg border-t pt-3">
          <span>{t('cart.totalPrice')}</span>
          <span>${Number(cartTotal).toFixed(2)}</span>
        </div>
      </div>

      <div className="cart-summary__actions mt-5">
        <Link
          to="/checkout"
          aria-disabled={isEmpty}
          tabIndex={isEmpty ? -1 : 0}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-center font-medium transition ${
            isEmpty
              ? "pointer-events-none bg-gray-300 text-gray-500"
              : "bg-black text-white hover:opacity-90"
          }`}
        >
          <span>{t('cart.proceedCheckout')}</span>
          <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
        </Link>

        <Link
          to="/catalog"
          className="cart-summary__secondary inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-center font-medium transition hover:bg-slate-50"
        >
          {t('cart.continueShopping')}
        </Link>
      </div>
    </aside>
  );
}

export default CartSummary;
