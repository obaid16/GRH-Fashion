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
  title: "GRH Fashion | Luxury Couture & Embroidery",
  description: "Experience the pinnacle of luxury couture, bridal gowns, and exquisite hand-crafted embroidery. Unforgettable runway fashion.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${cormorant.variable} ${poppins.variable} ${inter.variable} antialiased bg-brand-ivory text-brand-black selection:bg-brand-gold selection:text-white`}>
        <ContextMenuBlocker />
        <LuxuryNavbar />
        <main>{children}</main>
        <AnimatedFooter />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
