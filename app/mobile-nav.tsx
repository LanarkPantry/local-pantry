"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./cart-context";

const navItems = [
  {
    href: "/",
    label: "Home",
    icon: "🏠",
  },
  {
    href: "/shop",
    label: "Shop",
    icon: "🛍️",
  },
  {
    href: "/planner",
    label: "Plan",
    icon: "🗓️",
  },
  {
    href: "/my-kitchen",
    label: "Kitchen",
    icon: "🍽️",
  },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { cart } = useCart();

  const totalItems = cart.length;

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
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#e6ddd2] bg-white/95 backdrop-blur md:hidden">
      <nav className="mx-auto flex max-w-md items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-[56px] flex-col items-center gap-1 transition ${
                active
                  ? "text-[#243328]"
                  : "text-[#4f5e52] hover:text-[#243328]"
              }`}
            >
              <span className="text-lg">{item.icon}</span>

              <span
                className={`text-[11px] font-medium ${
                  active ? "underline underline-offset-4" : ""
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        <Link
          href="/basket"
          className={`flex min-w-[56px] flex-col items-center gap-1 transition ${
            isActive("/basket")
              ? "text-[#243328]"
              : "text-[#4f5e52] hover:text-[#243328]"
          }`}
        >
          <span className="text-lg">🛒</span>

          <span
            className={`text-[11px] font-medium ${
              isActive("/basket") ? "underline underline-offset-4" : ""
            }`}
          >
            Basket{totalItems > 0 ? ` (${totalItems})` : ""}
          </span>
        </Link>
      </nav>
    </div>
  );
}
