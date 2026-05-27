"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AccountNav from "../account-nav";
import { useCart } from "../cart-context";
import { useMemo } from "react";

const navItems = [
  { href: "/shop", label: "Shop" },
  { href: "/planner", label: "Plan Meals" },
  { href: "/my-kitchen", label: "My Kitchen" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { groupedCart } = useCart();

  const totalBasketItems = useMemo(
    () => groupedCart.reduce((sum, entry) => sum + entry.quantity, 0),
    [groupedCart],
  );

  function isActive(href: string) {
    if (href === "/my-kitchen") {
      return (
        pathname === "/my-kitchen" ||
        pathname.startsWith("/my-kitchen/") ||
        pathname === "/regulars" ||
        pathname.startsWith("/regulars/") ||
        pathname === "/saved-weeks" ||
        pathname.startsWith("/saved-weeks/")
      );
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

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
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition ${
                  active
                    ? "text-[#243328] underline underline-offset-4"
                    : "text-[#4f5e52] hover:text-[#243328]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/basket"
            className={`inline-flex shrink-0 rounded-full border border-[#d6cec2] px-4 py-2 text-sm shadow-sm transition hover:bg-white ${
              isActive("/basket")
                ? "bg-[#243328] text-white"
                : "bg-[rgba(255,255,255,0.86)] text-[#243328]"
            }`}
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
