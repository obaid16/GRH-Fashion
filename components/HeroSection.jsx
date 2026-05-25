"use client";

import { motion } from "framer-motion";
import LuxuryButton from "./LuxuryButton";

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image (Mock) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2000&auto=format&fit=crop')" }}
      >
        {/* Light overlay for luxury feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-ivory/90 via-brand-ivory/50 to-brand-ivory"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair tracking-wider text-brand-gold mb-6 uppercase leading-tight">
            Couture <br /> <span className="text-brand-gray italic font-cormorant lowercase">redefined</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="font-poppins text-sm md:text-base text-brand-gray tracking-widest uppercase mb-10 max-w-lg mx-auto"
        >
          Discover the pinnacle of luxury embroidery and bespoke fashion design.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <LuxuryButton variant="primary">Explore Collection</LuxuryButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
      >
        <span className="text-xs font-inter uppercase tracking-[0.3em] text-brand-gold/70 mb-4">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-12 bg-gradient-to-b from-brand-gold to-transparent"
        ></motion.div>
      </motion.div>
    </section>
  );
}
