import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Local Pantry",
  description: "Premium local fruit, veg and pantry staples",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}