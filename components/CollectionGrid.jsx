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
    <div>
      <div className="flex flex-wrap justify-center gap-4 md:gap-8 font-poppins text-xs uppercase tracking-widest text-brand-gray mb-16">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`cursor-pointer pb-1 transition-colors ${
              filter === cat ? "text-brand-purple border-b border-brand-purple font-medium" : "hover:text-brand-purple"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
