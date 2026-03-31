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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#f4efe9] text-[#243328]">
        <Providers>
          <div className="pb-32 md:pb-0">{children}</div>
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
