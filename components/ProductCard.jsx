"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function ProductCard({ product }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col cursor-pointer"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-pearl mb-6">
        {/* Placeholder image logic */}
        <img
          src={product.image || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop"}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-1000 ease-out group-hover:scale-105"
        />
        
        {/* Overlay hover effect */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex justify-between items-end bg-gradient-to-t from-black/40 to-transparent">
          <Link href={`/collection/${product.id}`} className="text-brand-ivory font-poppins text-[10px] uppercase tracking-[0.25em] flex items-center gap-3 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-brand-ivory group-hover/link:after:w-full after:transition-all after:duration-300 pb-1">
            View Design <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-start px-2">
        <h3 className="font-playfair text-xl md:text-2xl text-brand-black tracking-wide mb-2 group-hover:text-brand-gold transition-colors duration-500">{product.name}</h3>
        <p className="font-poppins text-[10px] text-brand-gray uppercase tracking-[0.2em] mb-3">{product.category}</p>
        <div className="w-4 h-[1px] bg-brand-gold/50 mb-3"></div>
        <p className="font-inter text-[11px] text-brand-gray/80 tracking-wide uppercase">Custom Fitting Available</p>
      </div>
    </motion.div>
  );
}
