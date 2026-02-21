import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { CartItem } from '@/types/types';
import { useAuth } from './auth-context';
import { API_BASE_URL } from '@/lib/env';

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
  const { user } = useAuth();
  
  // Track synchronization state
  const hasMergedLocalCart = useRef(false);
  const skipSyncRef = useRef(false);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Initial Load from LocalStorage
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

  const syncWithServer = useCallback(async (items: CartItem[]) => {
    if (!user) return;
    
    setIsSyncing(true);
    try {
      await fetch(`${API_BASE_URL}/me/cart`, {
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
  }, [user]);

  // 2. Fetch from Server if logged in
  useEffect(() => {
    if (user && isInitialized && !hasMergedLocalCart.current) {
      const fetchServerCart = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/me/cart`);
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

            // Merge local cart if it exists
            if (cart.length > 0) {
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
              
              skipSyncRef.current = false; // We WANT to sync the merged result back
              setCart(mergedCart);
              syncWithServer(mergedCart);
            } else {
              skipSyncRef.current = true; // Just loaded from server, don't POST it back
              setCart(serverItems);
            }
            hasMergedLocalCart.current = true;
          }
        } catch (e) {
          console.error("Failed to fetch server cart", e);
        }
      };
      fetchServerCart();
    }
  }, [user, isInitialized, syncWithServer]);

  // 3. Sync to LocalStorage and Server on changes
  useEffect(() => {
    if (!isInitialized) return;

    localStorage.setItem('cart', JSON.stringify(cart));
    
    if (user && hasMergedLocalCart.current) {
      if (skipSyncRef.current) {
        skipSyncRef.current = false;
        return;
      }

      // Debounce server sync
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = setTimeout(() => {
        syncWithServer(cart);
      }, 1000);
    }

    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [cart, isInitialized, user, syncWithServer]);

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
      if (newCart[index] && newCart[index].quantity > quantity) {
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
