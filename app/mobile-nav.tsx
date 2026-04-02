"use client";

import Link from "next/link";
import { useCart } from "./cart-context";

export default function MobileNav() {
  const { cart } = useCart();
  const totalItems = cart.length;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#e6ddd2] bg-white/95 backdrop-blur md:hidden">
      <nav className="mx-auto flex max-w-md items-center justify-around px-2 py-3">
        <Link
          href="/"
          className="flex min-w-[56px] flex-col items-center gap-1 text-[#4f5e52] transition hover:text-[#243328]"
        >
          <span className="text-lg">🏠</span>
          <span className="text-[11px] font-medium">Home</span>
        </Link>

        <Link
          href="/shop"
          className="flex min-w-[56px] flex-col items-center gap-1 text-[#4f5e52] transition hover:text-[#243328]"
        >
          <span className="text-lg">🛍️</span>
          <span className="text-[11px] font-medium">Shop</span>
        </Link>

        <Link
          href="/recipes"
          className="flex min-w-[56px] flex-col items-center gap-1 text-[#4f5e52] transition hover:text-[#243328]"
        >
          <span className="text-lg">🍽️</span>
          <span className="text-[11px] font-medium">Recipes</span>
        </Link>

        <Link
          href="/planner"
          className="flex min-w-[56px] flex-col items-center gap-1 text-[#4f5e52] transition hover:text-[#243328]"
        >
          <span className="text-lg">🗓️</span>
          <span className="text-[11px] font-medium">Planner</span>
        </Link>

        <Link
          href="/basket"
          className="flex min-w-[56px] flex-col items-center gap-1 text-[#4f5e52] transition hover:text-[#243328]"
        >
          <span className="text-lg">🛒</span>
          <span className="text-[11px] font-medium">
            Basket{totalItems > 0 ? ` (${totalItems})` : ""}
          </span>
        </Link>
      </nav>
    </div>
  );
}
