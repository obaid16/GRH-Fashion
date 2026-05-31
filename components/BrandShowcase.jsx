"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const brands = [
  "VOGUE",
  "HARPER'S BAZAAR",
  "ELLE",
  "GQ",
  "VANITY FAIR",
  "MARIE CLAIRE",
  "COSMOPOLITAN",
  "GLAMOUR"
];

export default function BrandShowcase() {
  return (
    <section className="py-20 bg-brand-pearl border-b border-brand-gold/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-xs font-poppins text-brand-gray uppercase tracking-[0.3em]"
        >
          Featured In
        </motion.p>
      </div>
      
      <div className="relative flex overflow-x-hidden group">
        {/* Gradients for smooth fade effect at edges */}
        <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-brand-pearl to-transparent z-10"></div>
        <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-brand-pearl to-transparent z-10"></div>
        
        <div className="flex animate-[marquee_25s_linear_infinite] whitespace-nowrap group-hover:[animation-play-state:paused]">
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <div 
              key={i} 
              className="flex items-center justify-center w-64 mx-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer"
            >
              <span className="font-playfair text-3xl font-bold tracking-widest text-brand-black">{brand}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
