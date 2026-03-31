import "./globals.css";
import { CartProvider } from "./cart-context";

export const metadata = {
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
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
