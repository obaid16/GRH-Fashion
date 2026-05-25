"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

// Using real GRH Fashion images
const galleryImages = [
  "/images/couture-gown-red.jpg",
  "/images/velvet-embroidery-maroon.jpg",
  "/images/crystal-bodice-gown.jpg",
  "/images/golden-gown.jpg",
  "/images/abstract-beaded-fabric.jpg",
  "/images/couture-gown-purple.jpg",
  "/images/velvet-embroidery-pink.jpg",
  "/images/crystal-embroidery.jpg",
  "/images/bugle-bead-leaves.jpg",
];

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="pt-32 pb-24 bg-brand-pearl min-h-screen">
      <div className="text-center px-6 mb-24 max-w-4xl mx-auto">
        <h3 className="text-xs font-poppins text-brand-gold uppercase tracking-[0.4em] mb-6">The Lookbook</h3>
        <h1 className="text-6xl md:text-8xl font-playfair text-brand-black mb-8 uppercase tracking-widest leading-[1.1]">
          Editorial <br/><span className="italic font-cormorant text-brand-gray lowercase">Archive</span>
        </h1>
        <div className="w-px h-24 bg-brand-gold/50 mx-auto"></div>
      </div>

      <div className="px-6 lg:px-12 max-w-[1600px] mx-auto">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {galleryImages.map((src, idx) => (
            <motion.div
              key={idx}
              layoutId={`gallery-image-${idx}`}
              className="relative overflow-hidden cursor-pointer group break-inside-avoid"
              onClick={() => setSelectedImage({ src, idx })}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="absolute inset-0 hidden md:block bg-brand-black/20 group-hover:bg-transparent transition-colors duration-700 z-10"></div>
              <img 
                src={src} 
                alt="Gallery Piece" 
                className="w-full h-auto object-cover filter md:grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 md:group-hover:scale-105"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fullscreen Cinematic Preview */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-black/95 backdrop-blur-xl p-4 md:p-12 cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-8 right-8 z-[110] text-white/50 hover:text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
            >
              <X className="w-10 h-10" />
            </button>
            
            <motion.img
              layoutId={`gallery-image-${selectedImage.idx}`}
              src={selectedImage.src}
              alt="Preview"
              className="max-w-full max-h-full object-contain shadow-2xl drop-shadow-[0_0_50px_rgba(168,124,30,0.2)]"
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
