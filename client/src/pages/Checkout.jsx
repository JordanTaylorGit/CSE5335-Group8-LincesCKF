/* Student 1 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import { fetchWithAuth } from "../services/api";

function Checkout() {
  const { t } = useTranslation();
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parseField = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
      return JSON.parse(field);
    } catch {
      return [];
    }
  };

  const getItemImage = (item) => {
    const images = parseField(item.images);
    return images[0] || item.image || '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert(t('checkout.empty_cart'));
      return;
    }

    const orderItems = cartItems.map((item) => ({
      productId: Number(item.productId || item.id),
      id: item.id,
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
      image: getItemImage(item),
    }));

    setIsSubmitting(true);
    try {
      const data = await fetchWithAuth('/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: orderItems,
          totalAmount: cartTotal,
          shippingAddress: {
            fullName: formData.fullName,
            address: formData.address,
            city: formData.city,
            zipCode: formData.zipCode
          }
        })
      });

      if (!Array.isArray(data.stockUpdates)) {
        setOrderMessage(t('checkout.inventory_unconfirmed'));
      } else {
        setOrderMessage(t('checkout.inventory_confirmed'));
      }
      setOrderPlaced(true);
      clearCart();

      setTimeout(() => {
        navigate("/");
      }, 2500);
    } catch (err) {
      alert(err.message || t('checkout.order_error'));
      setIsSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#f6f4f1] flex items-center justify-center px-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-3">{t('checkout.success_title')}</h1>
          <p className="text-gray-600 mb-4">
            {orderMessage || t('checkout.success_redirect')}
          </p>
          <Link
            to="/"
            className="inline-block bg-black text-white px-5 py-3 rounded-lg"
          >
            {t('checkout.go_home')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f4f1] px-4 py-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">{t('checkout.title')}</h1>

          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <h2 className="text-lg font-semibold">{t('checkout.shipping_details')}</h2>

            <input
              type="text"
              name="fullName"
              placeholder={t('checkout.full_name')}
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 outline-none"
            />

            <input
              type="email"
              name="email"
              placeholder={t('checkout.email_address')}
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 outline-none"
            />

            <input
              type="text"
              name="address"
              placeholder={t('checkout.address')}
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 outline-none"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="city"
                placeholder={t('checkout.city')}
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3 outline-none"
              />
              <input
                type="text"
                name="zipCode"
                placeholder={t('checkout.zip_code')}
                value={formData.zipCode}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3 outline-none"
              />
            </div>

            <h2 className="text-lg font-semibold pt-2">{t('checkout.payment_details')}</h2>

            <input
              type="text"
              name="cardName"
              placeholder={t('checkout.card_name')}
              value={formData.cardName}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 outline-none"
            />

            <input
              type="text"
              name="cardNumber"
              placeholder={t('checkout.card_number')}
              value={formData.cardNumber}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 outline-none"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="expiry"
                placeholder="MM/YY"
                value={formData.expiry}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3 outline-none"
              />
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                value={formData.cvv}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white rounded-lg px-4 py-3 font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {isSubmitting ? t('checkout.processing') : t('checkout.place_order')}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">{t('checkout.order_summary')}</h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-500">{t('checkout.empty_cart')}</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={getItemImage(item)}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {t('account.qty')}: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <p className="font-medium">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}

              <div className="flex justify-between pt-4 text-lg font-bold">
                <span>{t('account.total')}</span>
                <span>${Number(cartTotal).toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;
