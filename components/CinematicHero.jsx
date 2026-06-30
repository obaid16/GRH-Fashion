"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function CinematicHero({ content }) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);

  useGSAP(() => {
    // Parallax effect on the background image
    gsap.to(imageRef.current, {
      yPercent: 15,
      scale: 1.05,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Fade and translate text on scroll
    gsap.to(contentRef.current, {
      opacity: 0,
      y: -55,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, { scope: containerRef });

  const bgImage = content?.backgroundImage || '/images/replacement-62.png';
  const subheading = content?.subheading || 'Collection 2026';
  const heading = content?.heading || 'The Art Of Elegance';
  const description = content?.description || 'Discover the pinnacle of luxury couture, blending timeless silhouettes with masterful, hand-crafted embroidery tailored for the modern muse.';
  const ctaText = content?.ctaText || 'Explore Collection';
  const ctaLink = content?.ctaLink || '/collection';
  const quote = content?.quote || '"True luxury requires genuine materials and the craftsman\'s sincerity."';
  const author = content?.author || 'GRH Atelier';

  return (
    <section ref={containerRef} className="relative w-full h-screen min-h-[600px] overflow-hidden bg-brand-black">
      {/* Background Image with GSAP Parallax */}
      <div 
        ref={imageRef}
        className="absolute inset-0 w-full h-[115%] -top-[5%] bg-cover bg-center origin-bottom"
        style={{ backgroundImage: `url('${bgImage}')` }}
      >
        {/* Stronger gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black/90 via-brand-black/50 to-brand-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-transparent to-brand-black/30"></div>
      </div>

      {/* Noise overlay for cinematic feel */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

      {/* Content - Asymmetrical Editorial Layout */}
      <div ref={contentRef} className="relative z-10 h-full w-full max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 md:pt-40 pb-20 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-8 lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="flex items-center gap-4 mb-4 md:mb-6"
            >
              <div className="w-12 h-[1px] bg-brand-gold"></div>
              <h2 className="text-[10px] md:text-xs font-poppins text-brand-gold uppercase tracking-[0.4em]">
                {subheading}
              </h2>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair text-brand-ivory uppercase tracking-wider leading-[1.1] mb-6">
                {heading.includes("Elegance") ? (
                  <>
                    The Art Of <br/>
                    <span className="text-brand-gold/90 italic lowercase font-cormorant ml-8 md:ml-12 block md:inline font-light">Elegance</span>
                  </>
                ) : heading}
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
              className="max-w-md mb-8"
            >
              <p className="font-inter text-sm text-brand-ivory/80 leading-relaxed font-light">
                {description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 1 }}
              className="flex flex-wrap items-center gap-6"
            >
              <Link href={ctaLink}>
                <button className="group relative flex items-center gap-4 px-8 py-4 border border-brand-ivory/30 hover:border-brand-ivory transition-colors duration-500 backdrop-blur-sm bg-brand-ivory/5">
                  <span className="font-poppins text-[10px] uppercase tracking-[0.25em] text-brand-ivory">
                    {ctaText}
                  </span>
                  <ArrowRight className="w-4 h-4 text-brand-ivory group-hover:translate-x-1 transition-transform duration-500" strokeWidth={1.5} />
                </button>
              </Link>
            </motion.div>
          </div>

          <div className="md:col-span-4 lg:col-span-5 hidden md:flex flex-col items-end justify-center pt-20">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-right max-w-xs"
            >
              <p className="font-cormorant italic text-2xl text-brand-ivory/70 mb-4 leading-snug">{quote}</p>
              <div className="w-8 h-[1px] bg-brand-gold ml-auto mb-2"></div>
              <span className="font-poppins text-[9px] uppercase tracking-[0.3em] text-brand-gold">{author}</span>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Elegant Scroll Indicator */}
      <motion.div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1.5 }}
      >
        <div className="w-[1px] h-16 md:h-24 bg-gradient-to-b from-brand-ivory/30 to-transparent"></div>
      </motion.div>
    </section>
  );
}

