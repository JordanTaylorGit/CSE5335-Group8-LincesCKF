import { useCart } from "../context/CartContext";

function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div>
      <h1 style={{ marginBottom: "24px" }}>Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
                backgroundColor: "#ffffff",
                borderRadius: "14px",
                padding: "16px",
                marginBottom: "16px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />

              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 8px 0" }}>{item.name}</h3>
                <p style={{ margin: "0 0 8px 0" }}>${item.price}</p>
                <p style={{ margin: "0 0 12px 0" }}>Quantity: {item.quantity}</p>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                  <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}

          <h2>Total: ${totalPrice}</h2>
        </>
      )}
    </div>
  );
}

export default Cart;