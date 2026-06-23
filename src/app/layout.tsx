import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const GA_MEASUREMENT_ID = "AW-18244322023";
const GA_MEASUREMENT_ID_2 = "AW-18264254318";

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
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-ads-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
            gtag('config', '${GA_MEASUREMENT_ID_2}');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
