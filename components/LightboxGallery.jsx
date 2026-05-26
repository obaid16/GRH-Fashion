"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut } from "lucide-react";

export default function LightboxGallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [scale, setScale] = useState(1);

  const openLightbox = (src) => {
    setSelectedImage(src);
    setScale(1);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setScale(1);
  };

  const zoomIn = (e) => {
    e.stopPropagation();
    setScale(prev => Math.min(prev + 0.5, 3));
  };

  const zoomOut = (e) => {
    e.stopPropagation();
    setScale(prev => Math.max(prev - 0.5, 1));
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {images.map((src, index) => (
          <div 
            key={index} 
            className="relative h-48 md:h-64 overflow-hidden group cursor-pointer"
            onClick={() => openLightbox(src)}
          >
            <div className="absolute inset-0 bg-brand-black/20 group-hover:bg-brand-black/40 transition-colors duration-500 z-10 flex items-center justify-center">
              <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-8 h-8 drop-shadow-md" />
            </div>
            <img 
              src={src} 
              alt={`Reference Design ${index + 1}`} 
              className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-700"
            />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-8"
            onClick={closeLightbox}
          >
            <button 
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white z-[110] p-2 bg-black/50 rounded-full transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Zoom Controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-[110]">
              <button 
                onClick={zoomOut}
                disabled={scale <= 1}
                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md disabled:opacity-30 transition-all border border-white/10"
                title="Zoom Out"
              >
                <ZoomOut className="w-6 h-6" />
              </button>
              <button 
                onClick={zoomIn}
                disabled={scale >= 3}
                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md disabled:opacity-30 transition-all border border-white/10"
                title="Zoom In"
              >
                <ZoomIn className="w-6 h-6" />
              </button>
            </div>

            <div 
              className="relative max-w-6xl w-full h-[85vh] flex items-center justify-center overflow-auto hide-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: scale, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                src={selectedImage} 
                alt="Enlarged design" 
                className="max-w-full max-h-full object-contain"
                style={{ transformOrigin: "center" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
