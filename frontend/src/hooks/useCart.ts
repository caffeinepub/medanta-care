import { useState, useEffect, useCallback } from 'react';
import { type Product } from '../backend';

export interface CartItem {
  product: Product;
  quantity: number;
}

const CART_STORAGE_KEY = 'medanta_cart';

function loadCartFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return [];
}

function saveCartToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

// Simple global cart state using module-level variables + event system
let globalCart: CartItem[] = loadCartFromStorage();
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach(fn => fn());
}

export function useCart() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const update = () => forceUpdate(n => n + 1);
    listeners.add(update);
    return () => { listeners.delete(update); };
  }, []);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    const existing = globalCart.find(item => item.product.id === product.id);
    if (existing) {
      globalCart = globalCart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      globalCart = [...globalCart, { product, quantity }];
    }
    saveCartToStorage(globalCart);
    notifyListeners();
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    globalCart = globalCart.filter(item => item.product.id !== productId);
    saveCartToStorage(globalCart);
    notifyListeners();
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      globalCart = globalCart.filter(item => item.product.id !== productId);
    } else {
      globalCart = globalCart.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    }
    saveCartToStorage(globalCart);
    notifyListeners();
  }, []);

  const clearCart = useCallback(() => {
    globalCart = [];
    saveCartToStorage(globalCart);
    notifyListeners();
  }, []);

  const getCartTotal = useCallback(() => {
    return globalCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, []);

  const getItemCount = useCallback(() => {
    return globalCart.reduce((sum, item) => sum + item.quantity, 0);
  }, []);

  return {
    cartItems: globalCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount,
  };
}
