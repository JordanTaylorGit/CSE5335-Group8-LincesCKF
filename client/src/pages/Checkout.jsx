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

const INITIAL_FORM_DATA = {
  fullName: "",
  email: "",
  address: "",
  city: "",
  zipCode: "",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
};

const INITIAL_ERRORS = {
  fullName: "",
  email: "",
  address: "",
  city: "",
  zipCode: "",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
};

function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

function formatCardNumber(value) {
  return digitsOnly(value)
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}

function formatExpiry(value) {
  const digits = digitsOnly(value).slice(0, 4);

  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function isValidExpiry(expiry) {
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(String(expiry || "").trim());
  if (!match) return false;

  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  const expiryBoundary = new Date(year, month);

  return expiryBoundary > new Date();
}

function Checkout() {
  const { t, i18n } = useTranslation();
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState(INITIAL_ERRORS);

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
    const nextValue = {
      cardNumber: formatCardNumber,
      expiry: formatExpiry,
      cvv: (raw) => digitsOnly(raw).slice(0, 4),
      zipCode: (raw) => raw.slice(0, 10),
    }[name]?.(value) ?? value;

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const nextErrors = { ...INITIAL_ERRORS };
    const cardDigits = digitsOnly(formData.cardNumber);
    const cvvDigits = digitsOnly(formData.cvv);

    if (formData.fullName.trim().length < 2) {
      nextErrors.fullName = t('checkout.validation_full_name');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = t('checkout.validation_email');
    }

    if (formData.address.trim().length < 5) {
      nextErrors.address = t('checkout.validation_address');
    }

    if (formData.city.trim().length < 2) {
      nextErrors.city = t('checkout.validation_city');
    }

    if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode.trim())) {
      nextErrors.zipCode = t('checkout.validation_zip');
    }

    if (formData.cardName.trim().length < 2) {
      nextErrors.cardName = t('checkout.validation_card_name');
    }

    if (!cardDigits) {
      nextErrors.cardNumber = t('checkout.validation_card_number');
    }

    if (!isValidExpiry(formData.expiry)) {
      nextErrors.expiry = t('checkout.validation_expiry');
    }

    if (!/^\d{3,4}$/.test(cvvDigits)) {
      nextErrors.cvv = t('checkout.validation_cvv');
    }

    return nextErrors;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert(t('checkout.empty_cart'));
      return;
    }

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.values(validationErrors).some(Boolean)) {
      return;
    }

    const orderItems = cartItems.map((item) => ({
      productId: Number(item.productId || item.id),
      id: item.id,
      name: item.name,
      brandId: item.brandId || null,
      brandName: item.brandName || '',
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

      if (data.inventoryUpdated !== true || !Array.isArray(data.stockUpdates)) {
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
      <div className="checkout-page checkout-page--success min-h-screen bg-[#f6f4f1] flex items-center justify-center px-4">
        <div className="checkout-page__success-card bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
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

  const inputClassName = (fieldName) => `w-full border rounded-lg px-4 py-3 outline-none ${
    errors[fieldName] ? 'border-red-500 focus:ring-2 focus:ring-red-200' : ''
  }`;

  return (
    <div className="checkout-page min-h-screen bg-[#f6f4f1] px-4 py-8">
      <div className="checkout-page__layout max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        <div className="checkout-page__form-card bg-white rounded-2xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">{t('checkout.title')}</h1>

          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <h2 className="text-lg font-semibold">{t('checkout.shipping_details')}</h2>

            <div>
              <input
                type="text"
                name="fullName"
                placeholder={t('checkout.full_name')}
                value={formData.fullName}
                onChange={handleChange}
                required
                className={inputClassName('fullName')}
              />
              {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder={t('checkout.email_address')}
                value={formData.email}
                onChange={handleChange}
                required
                className={inputClassName('email')}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <input
                type="text"
                name="address"
                placeholder={t('checkout.address')}
                value={formData.address}
                onChange={handleChange}
                required
                className={inputClassName('address')}
              />
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>

            <div className="checkout-page__double-row grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="city"
                  placeholder={t('checkout.city')}
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className={inputClassName('city')}
                />
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
              </div>
              <div>
                <input
                  type="text"
                  name="zipCode"
                  placeholder={t('checkout.zip_code')}
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  inputMode="numeric"
                  className={inputClassName('zipCode')}
                />
                {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
              </div>
            </div>

            <h2 className="text-lg font-semibold pt-2">{t('checkout.payment_details')}</h2>

            <div>
              <input
                type="text"
                name="cardName"
                placeholder={t('checkout.card_name')}
                value={formData.cardName}
                onChange={handleChange}
                required
                className={inputClassName('cardName')}
              />
              {errors.cardName && <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>}
            </div>

            <div>
              <input
                type="text"
                name="cardNumber"
                placeholder={t('checkout.card_number')}
                value={formData.cardNumber}
                onChange={handleChange}
                required
                inputMode="numeric"
                autoComplete="cc-number"
                className={inputClassName('cardNumber')}
              />
              {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
            </div>

            <div className="checkout-page__double-row grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="expiry"
                  placeholder="MM/YY"
                  value={formData.expiry}
                  onChange={handleChange}
                  required
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  className={inputClassName('expiry')}
                />
                {errors.expiry && <p className="mt-1 text-sm text-red-600">{errors.expiry}</p>}
              </div>
              <div>
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={formData.cvv}
                  onChange={handleChange}
                  required
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  className={inputClassName('cvv')}
                />
                {errors.cvv && <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>}
              </div>
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

        <div className="checkout-page__summary-card bg-white rounded-2xl shadow-md p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">{t('checkout.order_summary')}</h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-500">{t('checkout.empty_cart')}</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.selectedColor || 'no-color'}-${item.selectedSize || 'no-size'}`}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={getItemImage(item)}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-medium">{i18n.language === 'es' ? item.nameEs || item.name : item.nameEn || item.name}</p>
                      {item.brandName && (
                        <p className="text-sm text-gray-500">
                          {t('product.brand')}: {item.brandName}
                        </p>
                      )}
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
