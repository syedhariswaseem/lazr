import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import { CartProvider } from "@/contexts/CartContext";
import { CheckoutProvider } from "@/contexts/CheckoutContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastContainer } from "@/components/Toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lazr - Industrial Laser Cutting Machinery",
  description: "Professional laser cutting solutions for industrial applications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <CartProvider>
            <CheckoutProvider>
              <ConditionalNavbar />
              <main className="min-h-screen">
                {children}
              </main>
              <ToastContainer />
            </CheckoutProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
