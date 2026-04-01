"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ShopItem = {
  name: string;
  price: number;
  image: string;
  category?: "boxes" | "pantry" | "cupboard" | "extras";
  checkoutType?: "subscription" | "one-off";
};

type CartContextType = {
  cart: ShopItem[];
  addToCart: (item: ShopItem) => void;
  addManyToCart: (items: ShopItem[]) => void;
  removeOneFromCart: (itemName: string) => void;
  clearItemFromCart: (itemName: string) => void;
  clearCart: () => void;
  getItemCount: (itemName: string) => number;
  total: number;
  groupedCart: { item: ShopItem; quantity: number }[];
  subscriptionItems: ShopItem[];
  oneOffItems: ShopItem[];
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ShopItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("local-pantry-cart");

    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        } else {
          setCart([]);
        }
      } catch {
        console.error("Failed to parse saved cart");
        setCart([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("local-pantry-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: ShopItem) => {
    setCart((current) => [...current, item]);
  };

  const addManyToCart = (items: ShopItem[]) => {
    if (items.length === 0) return;

    setCart((current) => [...current, ...items]);
  };

  const removeOneFromCart = (itemName: string) => {
    setCart((current) => {
      const index = current.findIndex((item) => item.name === itemName);

      if (index === -1) return current;

      return current.filter((_, i) => i !== index);
    });
  };

  const clearItemFromCart = (itemName: string) => {
    setCart((current) => current.filter((item) => item.name !== itemName));
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

  const subscriptionItems = useMemo(() => {
    return cart.filter((item) => item.checkoutType === "subscription");
  }, [cart]);

  const oneOffItems = useMemo(() => {
    return cart.filter((item) => item.checkoutType !== "subscription");
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        addManyToCart,
        removeOneFromCart,
        clearItemFromCart,
        clearCart,
        getItemCount,
        total,
        groupedCart,
        subscriptionItems,
        oneOffItems,
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
