"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import LuxuryButton from "./LuxuryButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function CinematicHero() {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);

  useGSAP(() => {
    // Parallax effect on the background image
    gsap.to(imageRef.current, {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Fade out text on scroll
    gsap.to(textRef.current, {
      opacity: 0,
      y: -50,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-screen overflow-hidden bg-brand-black">
      {/* Background Image with GSAP Parallax */}
      <div 
        ref={imageRef}
        className="absolute inset-0 w-full h-[130%] -top-[15%] bg-cover bg-center"
        style={{ backgroundImage: "url('/images/couture-gown-maroon.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black/60 via-brand-black/20 to-brand-black/80 mix-blend-multiply"></div>
      </div>

      {/* Noise overlay for cinematic feel */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

      {/* Content */}
      <div ref={textRef} className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <h2 className="text-xs md:text-sm font-poppins text-brand-gold uppercase tracking-[0.4em] mb-8">
            Luxury Couture • Handcrafted Elegance
          </h2>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-playfair text-brand-ivory uppercase tracking-widest leading-[1.1] mb-12 drop-shadow-2xl">
            Explore Your <br/> <span className="text-brand-gold italic lowercase font-cormorant">True Style</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 1 }}
          className="flex flex-col sm:flex-row gap-6"
        >
          <Link href="/collection">
            <button className="group relative px-10 py-4 overflow-hidden border border-brand-gold bg-brand-gold/10 backdrop-blur-md">
              <div className="absolute inset-0 w-full h-full bg-brand-gold scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
              <span className="relative z-10 font-poppins text-xs uppercase tracking-widest text-brand-ivory group-hover:text-brand-black transition-colors duration-500">
                Explore Collection
              </span>
            </button>
          </Link>
          <Link href="/contact">
            <button className="group relative px-10 py-4 overflow-hidden border border-brand-ivory/30 hover:border-brand-ivory/80 transition-colors duration-500 backdrop-blur-md">
              <span className="relative z-10 font-poppins text-xs uppercase tracking-widest text-brand-ivory transition-colors duration-500">
                Book Consultation
              </span>
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="font-poppins text-[10px] text-brand-ivory/50 uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-px h-16 bg-gradient-to-b from-brand-ivory/50 to-transparent"></div>
      </motion.div>
    </section>
  );
}
