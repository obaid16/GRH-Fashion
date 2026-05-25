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
      transition={{ duration: 0.6 }}
      className="group relative flex flex-col cursor-pointer bg-brand-pearl p-4 shadow-sm hover:shadow-xl transition-shadow duration-500 rounded-sm"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-white">
        {/* Placeholder image logic */}
        <img
          src={product.image || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop"}
          alt={product.name}
          className="object-cover w-full h-full transition-all duration-700 ease-out group-hover:scale-[1.03] opacity-100"
        />
        
        {/* Overlay hover effect */}
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex justify-between items-end bg-gradient-to-t from-white/90 to-transparent">
          <Link href={`/collection/${product.id}`} className="text-brand-purple font-poppins text-xs uppercase tracking-widest flex items-center gap-2 hover:text-brand-gold transition-colors">
            View Design <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="pt-6 pb-2 flex flex-col items-center text-center">
        <h3 className="font-playfair text-xl text-brand-black tracking-wide mb-2 group-hover:text-brand-purple transition-colors">{product.name}</h3>
        <p className="font-inter text-sm text-brand-gray uppercase tracking-[0.15em] mb-1">{product.category}</p>
        <p className="font-inter text-xs text-brand-gold tracking-[0.15em] uppercase">Custom Design Available</p>
      </div>
    </motion.div>
  );
}
