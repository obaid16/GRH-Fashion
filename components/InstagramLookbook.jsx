"use client";

import { motion } from "framer-motion";

const InstagramIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const instagramPosts = [
  "/images/replacement-62.png",
  "/images/replacement-32.jpg",
  "/images/replacement-41.jpg",
  "/images/replacement-40.jpg",
  "/images/replacement-52.jpg",
];

export default function InstagramLookbook() {
  return (
    <section className="py-12 md:py-24 overflow-hidden bg-brand-pearl border-y border-brand-gold/10">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16 px-6"
      >
        <h2 className="text-4xl md:text-5xl font-playfair text-brand-black mb-4 uppercase tracking-wider">The GRH <span className="text-brand-gold italic lowercase font-cormorant">World</span></h2>
        <div className="w-16 h-px bg-brand-purple mx-auto mb-6"></div>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-brand-gray hover:text-brand-purple transition-colors font-poppins text-xs uppercase tracking-widest">
          <InstagramIcon className="w-4 h-4" /> @GRHFashion
        </a>
      </motion.div>

      <div className="flex w-full overflow-hidden">
        {/* Animated seamless scroll if possible, else just a flex row. Using a simple row for now. */}
        <div className="flex w-full animate-marquee gap-1">
          {[...instagramPosts, ...instagramPosts].map((src, idx) => (
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" key={idx} className="relative flex-shrink-0 w-64 md:w-80 aspect-square overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-brand-purple/0 group-hover:bg-brand-purple/20 transition-colors duration-300 z-10 flex items-center justify-center">
                <InstagramIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-50 group-hover:scale-100" />
              </div>
              <img 
                src={src} 
                alt="Instagram post" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

