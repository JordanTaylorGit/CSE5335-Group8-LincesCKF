/* Student 1 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
const LEGACY_CART_STORAGE_KEY = "lincesckf_cart";
const GUEST_CART_STORAGE_KEY = "lincesckf_cart_guest";

function loadStoredCart(storageKey) {
  if (typeof window === "undefined") return [];

  try {
    const rawCart = window.localStorage.getItem(storageKey);
    if (!rawCart) return [];

    const parsedCart = JSON.parse(rawCart);
    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch {
    return [];
  }
}

function migrateLegacyGuestCart() {
  if (typeof window === "undefined") return;

  try {
    const legacyCart = window.localStorage.getItem(LEGACY_CART_STORAGE_KEY);
    const guestCart = window.localStorage.getItem(GUEST_CART_STORAGE_KEY);

    if (legacyCart && !guestCart) {
      window.localStorage.setItem(GUEST_CART_STORAGE_KEY, legacyCart);
    }

    window.localStorage.removeItem(LEGACY_CART_STORAGE_KEY);
  } catch {
    // Ignore storage migration failures and continue with the active cart key.
  }
}

function decodeJwtPayload(token) {
  try {
    const payload = String(token || "").split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    const decoded = window.atob(padded);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function getStoredAuthIdentity() {
  if (typeof window === "undefined") return null;

  const token = window.localStorage.getItem("token");
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  if (!payload || !payload.id) return null;

  return {
    id: payload.id,
    email: payload.email || "",
    accountType: payload.accountType || "CUSTOMER",
  };
}

function getCartStorageKey(user) {
  const numericUserId = Number(user?.id ?? user?.userId);
  if (Number.isInteger(numericUserId) && numericUserId > 0) {
    return `lincesckf_cart_user_${numericUserId}`;
  }

  const email = String(user?.email || "").trim().toLowerCase();
  const accountType = String(user?.accountType || "guest").trim().toLowerCase();

  if (email) {
    return `lincesckf_cart_${accountType}_${encodeURIComponent(email)}`;
  }

  return GUEST_CART_STORAGE_KEY;
}

export function CartProvider({ children }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    migrateLegacyGuestCart();
    return loadStoredCart(getCartStorageKey(getStoredAuthIdentity()));
  });
  const [message, setMessage] = useState("");
  const [hydratedStorageKey, setHydratedStorageKey] = useState(null);
  const timerRef = useRef(null);
  const activeCartIdentity = user || getStoredAuthIdentity();
  const storageKey = useMemo(
    () => getCartStorageKey(activeCartIdentity),
    [activeCartIdentity?.id, activeCartIdentity?.userId, activeCartIdentity?.email, activeCartIdentity?.accountType]
  );

  const showMessage = (text) => {
    setMessage(text);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setMessage("");
    }, 5000);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    migrateLegacyGuestCart();
    setCartItems(loadStoredCart(storageKey));
    setHydratedStorageKey(storageKey);
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === "undefined" || hydratedStorageKey !== storageKey) return;

    window.localStorage.setItem(storageKey, JSON.stringify(cartItems));
  }, [cartItems, storageKey, hydratedStorageKey]);

  useEffect(() => () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  const parseListField = (field) => {
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
    const sizes = parseListField(product.sizes);
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
      } catch {
        parsedColors = [];
      }
      
      const selectedColorEntry = parsedColors.find((color) => (color.name || color) === selectedColor);
      return [
        ...prevItems,
        {
          ...product,
          selectedColor,
          selectedColorEs: selectedColorEntry?.nameEs || selectedColor,
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
