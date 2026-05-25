"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageLightbox({ image, isOpen, onClose }) {
  if (!isOpen || !image) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 backdrop-blur-md"
      >
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-brand-gray hover:text-brand-purple transition-colors z-50"
        >
          <X className="w-8 h-8" />
        </button>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative max-w-5xl max-h-[85vh] w-full px-4 flex flex-col items-center"
        >
          <img
            src={image.url}
            alt={image.title || "Lightbox view"}
            className="max-h-[80vh] w-auto object-contain border border-brand-gold/20 shadow-2xl shadow-brand-purple/10"
          />
          {image.title && (
            <div className="mt-6 text-center">
              <h3 className="text-2xl font-playfair text-brand-black">{image.title}</h3>
              {image.description && (
                <p className="mt-2 text-sm font-inter text-brand-gray uppercase tracking-widest">{image.description}</p>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
