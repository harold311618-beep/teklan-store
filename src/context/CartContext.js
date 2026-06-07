"use client";

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'teklan_cart';

const getProductPrice = (product) => {
  const price = Number(product?.Precio ?? product?.price ?? 0);
  return Number.isFinite(price) ? price : 0;
};

const normalizeCartProduct = (product) => ({
  id: String(product.id),
  name: product.Nombre || product.name || "Producto Teklan",
  price: getProductPrice(product),
  imageUrl: product.imagenUrl || product.imageUrl || "",
});

const loadInitialCart = () => {
  if (typeof window === 'undefined') return [];

  try {
    const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadInitialCart);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const cart = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      items,
      total,
      totalItems,
      addItem(product) {
        const cartProduct = normalizeCartProduct(product);

        setItems((currentItems) => {
          const existingItem = currentItems.find((item) => item.id === cartProduct.id);

          if (existingItem) {
            return currentItems.map((item) => (
              item.id === cartProduct.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ));
          }

          return [...currentItems, { ...cartProduct, quantity: 1 }];
        });
      },
      removeItem(productId) {
        setItems((currentItems) => currentItems.filter((item) => item.id !== productId));
      },
      increaseItem(productId) {
        setItems((currentItems) => currentItems.map((item) => (
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        )));
      },
      decreaseItem(productId) {
        setItems((currentItems) => currentItems
          .map((item) => (
            item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
          ))
          .filter((item) => item.quantity > 0));
      },
      clearCart() {
        setItems([]);
      },
    };
  }, [items]);

  return (
    <CartContext.Provider value={cart}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }

  return context;
}
