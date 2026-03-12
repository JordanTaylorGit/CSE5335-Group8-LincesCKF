import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartMessage, setCartMessage] = useState("");

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);

      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevItems, { ...product, quantity: 1 }];
    });

    setCartMessage(`${product.name} added to cart`);
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => {
      const removed = prevItems.find((item) => item.id === id);

      if (removed) {
        setCartMessage(`${removed.name} removed from cart`);
      }

      return prevItems.filter((item) => item.id !== id);
    });
  };

  useEffect(() => {
    if (!cartMessage) return;

    const timer = setTimeout(() => {
      setCartMessage("");
    }, 2000);

    return () => clearTimeout(timer);
  }, [cartMessage]);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    cartCount,
    cartMessage,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    console.error("useCart must be used inside CartProvider");
    return {};
  }

  return context;
}