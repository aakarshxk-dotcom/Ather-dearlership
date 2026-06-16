import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Ather Energy Dealership — Partner with India's Leading EV Brand",
  description: "Join the Ather Energy dealership network. Apply now to become a franchise partner and be part of India's electric vehicle revolution.",
  keywords: "Ather Energy, dealership, franchise, electric scooter, EV, partnership, Ather 450X, Rizta",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
