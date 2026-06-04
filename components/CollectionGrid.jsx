"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";

export default function CollectionGrid({ products }) {
  const [filter, setFilter] = useState("All");

  const categories = ["All", "Luxury Gowns", "Bridal Couture", "Embroidery"];

  const filteredProducts = products.filter(product => {
    if (filter === "All") return true;
    if (filter === "Luxury Gowns") return ["Luxury Gowns", "Couture Gowns"].includes(product.category);
    if (filter === "Bridal Couture") return product.category === "Bridal Couture";
    if (filter === "Embroidery") return ["Embroidery Designs", "Fabric Work"].includes(product.category);
    return product.category === filter;
  });

  return (
    <div className="w-full relative">
      <div className="flex flex-wrap justify-center gap-6 md:gap-12 font-poppins text-[10px] md:text-xs uppercase tracking-[0.2em] text-brand-gray mb-16 md:mb-24">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`cursor-pointer pb-2 transition-all duration-500 relative ${
              filter === cat ? "text-brand-black font-medium" : "hover:text-brand-black"
            }`}
          >
            {cat}
            <span 
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-brand-black transition-all duration-500 ${
                filter === cat ? "w-full" : "w-0"
              }`} 
            />
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-20 sm:gap-y-12">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full ${
                index % 3 === 1 ? "sm:mt-16 lg:mt-32" : index % 3 === 2 ? "lg:mt-16" : ""
              }`}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
