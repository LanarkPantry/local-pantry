import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import MobileNav from "./mobile-nav";

export const metadata: Metadata = {
  title: "The Local Pantry",
  description: "Seasonal groceries from local farms",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="text-[#243328] antialiased">
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          {/* Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.28]"
            style={{ backgroundImage: "url('/hero.jpg')" }}
          />

          {/* Single soft cream wash (no gradient) */}
          <div className="absolute inset-0 bg-[rgba(247,244,236,0.55)]" />
        </div>

        <Providers>
          <div className="relative z-10 pb-32 md:pb-0">{children}</div>

          <div className="relative z-10">
            <MobileNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
