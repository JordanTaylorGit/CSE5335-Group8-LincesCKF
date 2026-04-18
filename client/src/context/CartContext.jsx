/* Student 1 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import { createContext, useContext, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState("");
  const timerRef = useRef(null);

  const showMessage = (text) => {
    setMessage(text);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setMessage("");
    }, 5000);
  };

  const parseField = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
      return JSON.parse(field);
    } catch {
      return [];
    }
  };

  const getSizeName = (size) => {
    if (typeof size === "string") return size;
    return String(size?.name || size?.size || size?.label || "");
  };

  const getSizeStock = (size) => {
    if (!size || typeof size !== "object") return null;
    const stock = Number(size.stockQuantity ?? size.stock ?? size.quantity);
    return Number.isFinite(stock) ? stock : null;
  };

  const getAvailableStock = (product, selectedSize) => {
    const sizes = parseField(product.sizes);
    const size = sizes.find(
      (entry) => getSizeName(entry).toLowerCase() === String(selectedSize || "").toLowerCase()
    );
    const sizeStock = getSizeStock(size);

    if (sizeStock !== null) return sizeStock;

    const stock = Number(product.stockQuantity);
    return Number.isFinite(stock) ? stock : Infinity;
  };

  const addToCart = (product, selectedColor, selectedSize) => {
    if (!selectedColor || !selectedSize) {
      showMessage(t('cart.select_color_size'));
      return;
    }

    const availableStock = getAvailableStock(product, selectedSize);
    if (availableStock <= 0) {
      showMessage(t('product.out_of_stock'));
      return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) =>
          item.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );

      if (existingItem) {
        if (existingItem.quantity >= availableStock) {
          showMessage(t('cart.only_stock_available', { count: availableStock }));
          return prevItems;
        }

        showMessage(t('cart.quantity_updated'));
        return prevItems.map((item) =>
          item.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      showMessage(t('cart.product_added'));
      let parsedColors = [];
      try {
        parsedColors = typeof product.colors === 'string' ? JSON.parse(product.colors) : (product.colors || []);
      } catch (e) {}
      
      const colorObj = parsedColors.find(c => (c.name || c) === selectedColor);
      return [
        ...prevItems,
        {
          ...product,
          selectedColor,
          selectedColorEs: colorObj?.nameEs || selectedColor,          
          selectedSize,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (id, selectedColor, selectedSize) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(
            item.id === id &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
          )
      )
    );

    showMessage(t('cart.product_removed'));
  };

  const increaseQuantity = (id, selectedColor, selectedSize) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (
          item.id === id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
        ) {
          const availableStock = getAvailableStock(item, selectedSize);
          if (item.quantity >= availableStock) {
            showMessage(t('cart.only_stock_available', { count: availableStock }));
            return item;
          }

          return { ...item, quantity: item.quantity + 1 };
        }

        return item;
      })
    );
  };

  const decreaseQuantity = (id, selectedColor, selectedSize) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + Number(item.price) * item.quantity, 0),
    [cartItems]
  );

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        clearCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        cartCount,
        cartTotal,
        message,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
