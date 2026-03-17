import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Checkout() {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setOrderPlaced(true);
    clearCart();

    setTimeout(() => {
      navigate("/");
    }, 2500);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#f6f4f1] flex items-center justify-center px-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-3">Order Placed Successfully</h1>
          <p className="text-gray-600 mb-4">
            Your order has been placed. Redirecting to home page...
          </p>
          <Link
            to="/"
            className="inline-block bg-black text-white px-5 py-3 rounded-lg"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f4f1] px-4 py-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>

          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <h2 className="text-lg font-semibold">Shipping Details</h2>

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 outline-none"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 outline-none"
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 outline-none"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3 outline-none"
              />
              <input
                type="text"
                name="zipCode"
                placeholder="ZIP Code"
                value={formData.zipCode}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3 outline-none"
              />
            </div>

            <h2 className="text-lg font-semibold pt-2">Payment Details</h2>

            <input
              type="text"
              name="cardName"
              placeholder="Name on Card"
              value={formData.cardName}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 outline-none"
            />

            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number"
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
              className="w-full bg-black text-white rounded-lg px-4 py-3 font-medium hover:opacity-90 transition"
            >
              Place Order
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <p className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}

              <div className="flex justify-between pt-4 text-lg font-bold">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Checkout;