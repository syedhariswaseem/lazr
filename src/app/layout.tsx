import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import { CartProvider } from "@/contexts/CartContext";
import { CheckoutProvider } from "@/contexts/CheckoutContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastContainer } from "@/components/Toast";
import { AuthProvider } from "@/contexts/AuthContext";

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
      <body className={`${inter.className} bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100`}>
        <ThemeProvider>
          <CartProvider>
            <CheckoutProvider>
              <AuthProvider>
                <ConditionalNavbar />
                <main className="min-h-screen">
                  {children}
                </main>
                <ToastContainer />
              </AuthProvider>
            </CheckoutProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
