import Link from "next/link";

type SiteFooterProps = {
  hideContactEmail?: boolean;
};

export default function SiteFooter({
  hideContactEmail = false,
}: SiteFooterProps) {
  return (
    <footer className="border-t border-[#ddd4c8] bg-[#243328] px-4 py-10 text-white sm:px-6 md:px-10">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
        <div>
          <p className="font-serif text-2xl">The Local Pantry</p>

          <p className="mt-3 max-w-md text-sm leading-7 text-white/70">
            Local fruit and veg delivery with regular staples and simple meal
            support for calmer weekly cooking.
          </p>

          <p className="mt-4 text-sm text-white/70">
            Delivering around Lanark, Carluke and surrounding areas.
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-white">Explore</p>

          <div className="mt-4 flex flex-col gap-2 text-sm text-white/70">
            <Link href="/shop" className="hover:text-white">
              Shop
            </Link>

            <Link href="/planner" className="hover:text-white">
              Plan Meals
            </Link>

            <Link href="/my-kitchen" className="hover:text-white">
              My Kitchen
            </Link>

            <Link href="/delivery" className="hover:text-white">
              Delivery
            </Link>

            <Link href="/basket" className="hover:text-white">
              Basket
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-white">Help</p>

          <div className="mt-4 flex flex-col gap-2 text-sm text-white/70">
            {!hideContactEmail ? (
              <a
                href="mailto:hello@thelocalpantry.shop"
                className="hover:text-white"
              >
                hello@thelocalpantry.shop
              </a>
            ) : null}

            <Link href="/contact" className="hover:text-white">
              Contact
            </Link>

            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>

            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} The Local Pantry.</p>

        <p>Useful food for normal weeks.</p>
      </div>
    </footer>
  );
}
