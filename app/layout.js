import { Playfair_Display, Cormorant_Garamond, Poppins, Inter } from "next/font/google";
import LuxuryNavbar from "@/components/LuxuryNavbar";
import AnimatedFooter from "@/components/AnimatedFooter";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

import ContextMenuBlocker from "@/components/ContextMenuBlocker";

export const metadata = {
  metadataBase: new URL('https://grhfashion.com'),
  title: {
    default: "GRH Fashion | Luxury Couture & Embroidery",
    template: "%s | GRH Fashion",
  },
  description: "Experience the pinnacle of luxury couture, bridal gowns, and exquisite hand-crafted embroidery. Unforgettable runway fashion.",
  keywords: ["luxury fashion", "couture", "bridal gowns", "embroidery", "designer dresses", "GRH Fashion", "bespoke clothing"],
  authors: [{ name: "GRH Atelier" }],
  creator: "GRH Fashion",
  publisher: "GRH Fashion",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "GRH Fashion | Luxury Couture",
    description: "Experience the pinnacle of luxury couture and exquisite hand-crafted embroidery.",
    url: "https://grhfashion.com",
    siteName: "GRH Fashion",
    images: [
      {
        url: "/images/logo-new.png",
        width: 1200,
        height: 630,
        alt: "GRH Fashion Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GRH Fashion | Luxury Couture",
    description: "Experience the pinnacle of luxury couture and exquisite hand-crafted embroidery.",
    images: ["/images/logo-new.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import SmoothScroll from "@/components/SmoothScroll";

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="overflow-x-hidden">
      <body className={`${playfair.variable} ${cormorant.variable} ${poppins.variable} ${inter.variable} antialiased bg-brand-ivory text-brand-black selection:bg-brand-gold selection:text-white overflow-x-hidden w-full relative`}>
        <SmoothScroll />
        <ContextMenuBlocker />
        <LuxuryNavbar />
        <main>{children}</main>
        <AnimatedFooter />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
