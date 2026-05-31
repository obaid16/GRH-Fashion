"use client";

import { motion } from "framer-motion";

export default function FashionGallery({ images = [], onImageClick = () => {} }) {
  if (!images || images.length === 0) return null;

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
      {images.map((img, index) => (
        <motion.div
          key={img.id || index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index % 3 * 0.1 }}
          className="relative group overflow-hidden cursor-zoom-in break-inside-avoid"
          onClick={() => onImageClick(img)}
        >
          <img
            src={img.url}
            alt={img.title || "Gallery image"}
            className="w-full h-auto object-cover transition-transform duration-700 ease-in-out group-hover:scale-105 opacity-90 group-hover:opacity-100 filter grayscale-[10%] group-hover:grayscale-0 shadow-sm"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-center p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <h4 className="font-playfair text-xl text-brand-black mb-2">{img.title}</h4>
              {img.description && <p className="font-inter text-xs text-brand-gray uppercase tracking-widest">{img.description}</p>}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
