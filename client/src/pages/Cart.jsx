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
import { Link } from "react-router-dom";

function Cart() {
  const { cartItems } = useCart();
  const { t } = useTranslation();

  return (
    <div className="cart-page bg-[#f2f2f2] min-h-screen px-4 py-8">
      <div className="cart-page__header max-w-6xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-slate-900">{t('cart.title')}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          {t('cart.subtitle')}
        </p>
      </div>

      <div className="cart-page__layout max-w-6xl mx-auto grid md:grid-cols-[2fr_1fr] gap-6">
        <div className="cart-page__items-card bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">{t('cart.orderSummary')}</h2>

          {cartItems.length === 0 ? (
            <div className="cart-page__empty flex flex-col items-start gap-3 text-slate-600">
              <p className="text-lg font-medium text-slate-900">{t('cart.empty')}</p>
              <p className="text-sm leading-6">{t('cart.emptyText')}</p>
              <Link
                to="/catalog"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
              >
                {t('cart.continueShopping')}
              </Link>
            </div>
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
