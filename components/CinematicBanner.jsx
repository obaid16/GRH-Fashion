"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CinematicBanner({ content }) {
  const bgImage = content?.image || '/images/replacement-30.jpg';
  const heading = content?.heading || 'Exquisite Artistry';
  const description = content?.description || '"A timeless creation tailored to reflect your inner beauty."';
  const ctaText = content?.ctaText || 'Explore The Lookbook';
  const ctaLink = content?.ctaLink || '/gallery';

  return (
    <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden my-24">
      {/* Background Video/Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed scale-105"
        style={{ backgroundImage: `url('${bgImage}')` }}
      >
        <div className="absolute inset-0 bg-brand-black/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-sm font-poppins text-brand-ivory uppercase tracking-[0.3em] mb-6"
        >
          Exclusive Masterpiece
        </motion.h2>
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-playfair text-brand-gold mb-8 uppercase tracking-widest leading-tight"
        >
          {heading.includes("Artistry") ? (
            <>
              Exquisite <br className="hidden md:block" /> Artistry
            </>
          ) : heading}
        </motion.h3>
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          whileInView={{ opacity: 1, height: 96 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-px h-24 bg-brand-gold/50 mb-8"
        ></motion.div>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-cormorant text-2xl md:text-3xl text-brand-ivory italic mb-10"
        >
          {description}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link href={ctaLink} className="inline-block border border-brand-gold bg-brand-gold/10 backdrop-blur-sm text-brand-gold px-10 py-4 font-poppins text-xs uppercase tracking-widest hover:bg-brand-gold hover:text-white transition-all duration-300">
            {ctaText}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

