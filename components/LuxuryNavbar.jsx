"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { name: "Home", href: "/" },
  { name: "Collection", href: "/collection" },
  { name: "Custom Design", href: "/custom-design" },
  { name: "Gallery", href: "/gallery" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function LuxuryNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isDarkHeader = pathname === "/";
  const forceSolidNav = pathname === "/contact";
  const shouldInvert = !isScrolled && isDarkHeader && !forceSolidNav && !mobileMenuOpen;
  const showSolidNav = isScrolled || forceSolidNav;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-0 inset-x-0 z-[100] transition-all duration-700",
          showSolidNav 
            ? "bg-brand-ivory/95 backdrop-blur-md border-b border-brand-black/5 py-3" 
            : "bg-transparent py-6"
        )}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group relative flex items-center z-50">
            <img 
              src="/images/logo-new.png" 
              alt="GRH Fashion Logo" 
              className={cn(
                "h-8 md:h-12 w-auto object-contain transition-all duration-700",
                shouldInvert ? "brightness-0 invert opacity-90" : "opacity-100"
              )}
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-10">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-[11px] font-medium uppercase tracking-[0.2em] font-poppins transition-all duration-500 relative group",
                  pathname === link.href 
                    ? (shouldInvert ? "text-brand-ivory" : "text-brand-black")
                    : (shouldInvert 
                      ? "text-brand-ivory/60 hover:text-brand-ivory" 
                      : "text-brand-gray hover:text-brand-black")
                )}
              >
                {link.name}
                <span
                  className={cn(
                    "absolute -bottom-2 left-0 h-[1px] transition-all duration-500 ease-out",
                    shouldInvert ? "bg-brand-ivory" : "bg-brand-black",
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            ))}
          </div>

          {/* Icons & Mobile Toggle */}
          <div className="flex items-center gap-6 z-50">
            <Link 
              href="/contact" 
              className={cn(
                "hidden md:inline-flex items-center justify-center px-8 py-3 border text-[10px] font-medium uppercase tracking-[0.25em] transition-all duration-500",
                shouldInvert
                  ? "border-brand-ivory/50 text-brand-ivory hover:bg-brand-ivory hover:text-brand-black hover:border-brand-ivory"
                  : "border-brand-black/20 text-brand-black hover:bg-brand-black hover:text-brand-ivory hover:border-brand-black"
              )}
            >
              Book Consultation
            </Link>
            <button
              className={cn(
                "md:hidden transition-all duration-500 p-2 -mr-2",
                shouldInvert ? "text-brand-ivory" : "text-brand-black"
              )}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-7 h-7 font-light" strokeWidth={1} />
              ) : (
                <Menu className="w-7 h-7 font-light" strokeWidth={1} />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.2 } }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-brand-ivory flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center space-y-6 w-full px-6">
              {links.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, transition: { duration: 0.3, delay: i * 0.05 } }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "text-4xl sm:text-5xl font-cormorant tracking-widest uppercase italic block py-2",
                      pathname === link.href ? "text-brand-gold" : "text-brand-black hover:text-brand-gold transition-colors duration-500"
                    )}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="absolute bottom-12 flex flex-col items-center space-y-4"
            >
              <Link 
                href="/contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-8 py-3 border border-brand-black text-brand-black text-[10px] uppercase tracking-[0.25em]"
              >
                Book Consultation
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
