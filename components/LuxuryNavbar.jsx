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
  const shouldInvert = !isScrolled && isDarkHeader && !forceSolidNav;
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
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={cn(
          "fixed top-0 inset-x-0 z-[100] transition-all duration-500",
          showSolidNav 
            ? "bg-brand-ivory/95 backdrop-blur-md border-b border-brand-gold/30 py-2 shadow-sm" 
            : "bg-transparent py-4"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group relative flex items-center">
            <img 
              src="/images/logo-new.png" 
              alt="GRH Fashion Logo" 
              className={cn(
                "h-10 md:h-14 w-auto object-contain transition-all duration-500",
                shouldInvert ? "brightness-0 invert" : ""
              )}
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-[13px] font-semibold uppercase tracking-[0.15em] font-inter transition-all duration-300 relative group",
                  pathname === link.href 
                    ? "text-brand-purple" 
                    : shouldInvert 
                      ? "text-white/80 hover:text-white" 
                      : "text-brand-black/80 hover:text-brand-purple"
                )}
              >
                {link.name}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-px bg-brand-gold transition-all duration-300",
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            ))}
          </div>

          {/* Icons & Mobile Toggle */}
          <div className="flex items-center gap-5">
            <Link 
              href="/contact" 
              className={cn(
                "hidden md:inline-flex items-center justify-center px-6 py-2 border text-[11px] uppercase tracking-[0.2em] transition-all duration-300",
                shouldInvert
                  ? "border-white text-white hover:bg-white hover:text-brand-black"
                  : "border-brand-black text-brand-black hover:bg-brand-purple hover:text-white hover:border-brand-purple"
              )}
            >
              Book Consultation
            </Link>
            <button
              className={cn(
                "md:hidden transition-colors p-2",
                shouldInvert ? "text-white hover:text-brand-gold" : "text-brand-black/80 hover:text-brand-purple"
              )}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-brand-ivory flex flex-col items-center justify-center space-y-8"
          >
            {links.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "text-2xl font-playfair tracking-wider uppercase",
                    pathname === link.href ? "text-brand-purple" : "text-brand-black hover:text-brand-gold transition-colors"
                  )}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
