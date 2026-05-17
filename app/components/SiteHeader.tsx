"use client";

import Link from "next/link";
import AccountNav from "../account-nav";
import { useCart } from "../cart-context";
import { useMemo } from "react";

export default function SiteHeader() {
  const { groupedCart } = useCart();

  const totalBasketItems = useMemo(
    () => groupedCart.reduce((sum, entry) => sum + entry.quantity, 0),
    [groupedCart],
  );

  return (
    <header className="sticky top-0 z-30 border-b border-[rgba(230,221,210,0.9)] bg-[rgba(244,239,233,0.78)] backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 md:px-10">
        <Link
          href="/"
          className="text-sm tracking-[0.35em] text-[#60705f] hover:text-[#243328]"
        >
          THE LOCAL PANTRY
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/shop"
            className="text-sm text-[#4f5e52] hover:text-[#243328]"
          >
            Shop
          </Link>

          <Link
            href="/planner"
            className="text-sm text-[#4f5e52] hover:text-[#243328]"
          >
            Planner
          </Link>

          <Link
            href="/regulars"
            className="text-sm text-[#4f5e52] hover:text-[#243328]"
          >
            My Regulars
          </Link>

          <Link
            href="/saved-weeks"
            className="text-sm text-[#4f5e52] hover:text-[#243328]"
          >
            Saved Weeks
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/basket"
            className="inline-flex shrink-0 rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.86)] px-4 py-2 text-sm text-[#243328] shadow-sm transition hover:bg-white"
          >
            Basket
            {totalBasketItems > 0 ? ` (${totalBasketItems})` : ""}
          </Link>

          <AccountNav />
        </div>
      </div>
    </header>
  );
}
