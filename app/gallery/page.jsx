"use client";

import { useState } from "react";
import FashionGallery from "@/components/FashionGallery";
import ImageLightbox from "@/components/ImageLightbox";
import content from "@/data/content.json";

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="pt-32 pb-24 px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-playfair text-brand-gold mb-6 uppercase tracking-widest">Gallery</h1>
        <div className="w-16 h-px bg-brand-purple mx-auto mb-8"></div>
        <p className="font-inter text-brand-gray max-w-2xl mx-auto leading-relaxed">
          A visual journey through our runway moments, artisan workshops, and editorial features.
        </p>
      </div>

      <FashionGallery 
        images={content.gallery} 
        onImageClick={(img) => setSelectedImage(img)} 
      />

      <ImageLightbox 
        image={selectedImage} 
        isOpen={!!selectedImage} 
        onClose={() => setSelectedImage(null)} 
      />
    </div>
  );
}
