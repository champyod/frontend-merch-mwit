"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { CartItem } from '@/types/types';
import { useAuth } from './auth-context';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number, quantity?: number) => void;
  clearCart: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const { user, isLoading: isAuthLoading } = useAuth();
  
  // Track if we've already merged the local cart to server after login
  const hasMergedLocalCart = useRef(false);

  // 1. Initial Load from LocalStorage (for anonymous or before sync)
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // 2. Fetch from Server if logged in
  useEffect(() => {
    if (user && isInitialized) {
      const fetchServerCart = async () => {
        try {
          const res = await fetch('/api/me/cart');
          const data = await res.json();
          if (!data.hasError && data.payload) {
            const serverItems = data.payload.map((ci: any) => ({
              item_id: ci.item_id,
              title: ci.item.title,
              price: ci.item.price,
              size: ci.size,
              color: ci.color,
              quantity: ci.quantity,
              image_url: ci.item.images?.[0]?.url
            }));

            // Merge local cart if it hasn't been done this session
            if (!hasMergedLocalCart.current && cart.length > 0) {
              const mergedCart = [...serverItems];
              cart.forEach(localItem => {
                const existing = mergedCart.find(
                  si => si.item_id === localItem.item_id && si.size === localItem.size && si.color === localItem.color
                );
                if (existing) {
                  existing.quantity += localItem.quantity;
                } else {
                  mergedCart.push(localItem);
                }
              });
              setCart(mergedCart);
              hasMergedLocalCart.current = true;
              // Sync back to server immediately after merge
              syncWithServer(mergedCart);
            } else {
              setCart(serverItems);
              hasMergedLocalCart.current = true;
            }
          }
        } catch (e) {
          console.error("Failed to fetch server cart", e);
        }
      };
      fetchServerCart();
    }
  }, [user, isInitialized]);

  // 3. Save to LocalStorage whenever cart changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // If logged in, sync to server (debounced or on change)
      if (user && hasMergedLocalCart.current) {
        syncWithServer(cart);
      }
    }
  }, [cart, isInitialized, user]);

  const syncWithServer = async (items: CartItem[]) => {
    setIsSyncing(true);
    try {
      await fetch('/api/me/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items.map(i => ({
          item_id: i.item_id,
          size: i.size,
          color: i.color,
          quantity: i.quantity
        })))
      });
    } catch (e) {
      console.error("Failed to sync cart", e);
    } finally {
      setIsSyncing(false);
    }
  };

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.item_id === item.item_id && i.size === item.size && i.color === item.color
      );
      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + item.quantity
        };
        return newCart;
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (index: number, quantity: number = 1) => {
    setCart((prev) => {
      const newCart = [...prev];
      if (newCart[index].quantity > quantity) {
        newCart[index] = { ...newCart[index], quantity: newCart[index].quantity - quantity };
        return newCart;
      }
      return newCart.filter((_, i) => i !== index);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, isLoading: !isInitialized || isSyncing }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
