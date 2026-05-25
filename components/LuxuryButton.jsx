"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function LuxuryButton({ children, className, onClick, type = "button", variant = "primary" }) {
  const baseStyles = "relative overflow-hidden px-8 py-3 font-poppins text-sm uppercase tracking-widest transition-all duration-300 group";
  
  const variants = {
    primary: "bg-transparent text-brand-black border border-brand-black hover:text-white hover:border-brand-black hover:shadow-lg hover:shadow-brand-black/20",
    solid: "bg-brand-gold text-white hover:bg-brand-purple hover:text-white border border-brand-gold hover:border-brand-purple shadow-md hover:shadow-xl hover:shadow-brand-purple/20",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      className={cn(baseStyles, variants[variant], className)}
    >
      <span className="relative z-10">{children}</span>
      {variant === "primary" && (
        <span className="absolute inset-0 bg-brand-black scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100 -z-0"></span>
      )}
    </motion.button>
  );
}
