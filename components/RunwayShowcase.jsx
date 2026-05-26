"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const runwayImages = [
  "/images/replacement-61.png",
  "/images/replacement-60.png",
  "/images/replacement-62.png",
];

export default function RunwayShowcase() {
  const containerRef = useRef(null);
  const sliderRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const slider = sliderRef.current;
      
      let scrollTween = gsap.to(slider, {
        xPercent: -100 + (100 / runwayImages.length),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          end: () => "+=" + slider.offsetWidth,
        }
      });
      
      return () => {
        scrollTween.kill();
      };
    });

    mm.add("(max-width: 767px)", () => {
      // Mobile animations
      const items = gsap.utils.toArray(sliderRef.current.children);
      
      items.forEach((item, i) => {
        gsap.fromTo(item, 
          { opacity: 0, y: 50 },
          { 
            opacity: 1, 
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full md:h-screen overflow-hidden bg-brand-pearl">
      <div className="absolute top-12 left-6 lg:left-12 z-20 mix-blend-difference text-white">
        <h2 className="text-sm font-poppins uppercase tracking-[0.3em]">The Collection</h2>
      </div>
      
      <div 
        ref={sliderRef} 
        className="flex flex-col md:flex-row h-full w-full md:w-[300vw] lg:w-[200vw]"
      >
        {runwayImages.map((src, index) => (
          <div 
            key={index} 
            className="w-full md:w-screen h-auto md:h-full flex items-center justify-center py-8 px-6 md:p-12 lg:p-24"
          >
            <div className="relative w-full max-w-4xl h-[60vh] md:h-[80vh] overflow-hidden group">
              <div className="absolute inset-0 bg-brand-black/10 group-hover:bg-transparent transition-colors duration-700 z-10"></div>
              <img 
                src={src} 
                alt={`Runway Look ${index + 1}`} 
                className="w-full h-full object-cover filter grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
              />
              <div className="absolute bottom-8 left-8 z-20 overflow-hidden">
                <h3 className="text-4xl md:text-6xl font-playfair text-white uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-700">
                  Look <span className="italic font-cormorant">{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

