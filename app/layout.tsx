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
