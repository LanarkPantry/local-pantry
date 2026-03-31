"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ShopItem = {
  name: string;
  price: number;
  image: string;
};

type CartContextType = {
  cart: ShopItem[];
  addToCart: (item: ShopItem) => void;
  removeOneFromCart: (itemName: string) => void;
  clearCart: () => void;
  getItemCount: (itemName: string) => number;
  total: number;
  groupedCart: { item: ShopItem; quantity: number }[];
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ShopItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("local-pantry-cart");

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        console.error("Failed to parse saved cart");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("local-pantry-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: ShopItem) => {
    setCart((current) => [...current, item]);
  };

  const removeOneFromCart = (itemName: string) => {
    setCart((current) => {
      const index = current.findIndex((item) => item.name === itemName);

      if (index === -1) return current;

      return current.filter((_, i) => i !== index);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const getItemCount = (itemName: string) => {
    return cart.filter((item) => item.name === itemName).length;
  };

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price, 0);
  }, [cart]);

  const groupedCart = useMemo(() => {
    const map = new Map<string, { item: ShopItem; quantity: number }>();

    cart.forEach((item) => {
      if (map.has(item.name)) {
        map.get(item.name)!.quantity += 1;
      } else {
        map.set(item.name, { item, quantity: 1 });
      }
    });

    return Array.from(map.values());
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeOneFromCart,
        clearCart,
        getItemCount,
        total,
        groupedCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
