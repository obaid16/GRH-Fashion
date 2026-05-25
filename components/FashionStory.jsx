"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function FashionStory() {
  const containerRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useGSAP(() => {
    // Only apply complex pinning on desktop
    let mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: leftRef.current,
        pinSpacing: false,
      });
    });

    mm.add("(max-width: 1023px)", () => {
      // Mobile animations
      gsap.fromTo(leftRef.current, 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          scrollTrigger: { 
            trigger: leftRef.current, 
            start: "top 85%" 
          } 
        }
      );
      
      const images = gsap.utils.toArray(rightRef.current.children);
      images.forEach((img) => {
        gsap.fromTo(img,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            scrollTrigger: {
              trigger: img,
              start: "top 80%",
            }
          }
        );
      });
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full bg-brand-ivory flex flex-col lg:flex-row">
      {/* Left side: Pinned Text */}
      <div 
        ref={leftRef} 
        className="w-full lg:w-1/2 lg:h-screen flex items-center justify-center p-12 lg:p-24 border-r border-brand-gold/20 z-10 bg-brand-ivory"
      >
        <div className="max-w-md">
          <h3 className="text-xs font-poppins text-brand-gold uppercase tracking-[0.3em] mb-6">The Fashion Story</h3>
          <h2 className="text-5xl lg:text-7xl font-playfair text-brand-black mb-8 leading-tight">
            A Legacy of <br/><span className="italic font-cormorant text-brand-gray">Craftsmanship</span>
          </h2>
          <p className="font-inter text-brand-gray/80 leading-loose mb-8">
            Every garment we create is a testament to the timeless art of haute couture. We blend ancient zardosi techniques with avant-garde silhouettes to craft pieces that are not merely worn, but experienced.
          </p>
          <div className="w-24 h-px bg-brand-purple"></div>
        </div>
      </div>

      {/* Right side: Scrolling Images */}
      <div ref={rightRef} className="w-full lg:w-1/2 flex flex-col">
        <div className="h-[70vh] lg:h-screen w-full relative">
          <img 
            src="/images/crystal-embroidery.jpg" 
            alt="Craftsmanship" 
            className="w-full h-full object-cover filter brightness-90 hover:brightness-100 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-brand-black/10"></div>
        </div>
        <div className="h-[70vh] lg:h-screen w-full relative">
          <img 
            src="/images/velvet-embroidery-maroon.jpg" 
            alt="Embroidery Detail" 
            className="w-full h-full object-cover filter brightness-90 hover:brightness-100 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-brand-black/10"></div>
        </div>
        <div className="h-[70vh] lg:h-screen w-full relative">
          <img 
            src="/images/couture-gown-purple.jpg" 
            alt="Final Gown" 
            className="w-full h-full object-cover filter brightness-90 hover:brightness-100 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-brand-black/10"></div>
        </div>
      </div>
    </section>
  );
}
