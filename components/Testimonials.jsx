"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Eleanor Vance",
    text: "The embroidery work is simply breathtaking. My bridal gown felt like a piece of art that belonged in a museum.",
    role: "Bride",
  },
  {
    id: 2,
    name: "Sophia Rossi",
    text: "GRH Fashion understands the essence of true luxury. The attention to detail in their couture pieces is unmatched.",
    role: "Fashion Editor",
  },
  {
    id: 3,
    name: "Isabella Chen",
    text: "Every thread tells a story. Wearing their custom design made me feel powerful, elegant, and completely unique.",
    role: "Client",
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    })
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 md:py-32 bg-brand-cream relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent"></div>
      
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <div className="mb-10 md:mb-16">
          <h2 className="text-sm font-poppins text-brand-gold uppercase tracking-[0.3em] mb-4">Client Stories</h2>
          <h3 className="text-4xl md:text-5xl font-playfair text-brand-black uppercase tracking-wider">
            Voices of <span className="text-brand-gray italic lowercase font-cormorant">Elegance</span>
          </h3>
        </div>

        <div className="relative h-[350px] flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.5 },
                scale: { duration: 0.5 }
              }}
              className="absolute w-full px-8 md:px-16"
            >
              <Quote className="mx-auto w-12 h-12 text-brand-gold/30 mb-8" />
              <p className="font-cormorant text-2xl md:text-4xl text-brand-gray leading-relaxed italic mb-8">
                "{testimonials[currentIndex].text}"
              </p>
              <div>
                <h4 className="font-playfair text-brand-black text-xl mb-1">{testimonials[currentIndex].name}</h4>
                <p className="font-poppins text-xs uppercase tracking-widest text-brand-gold">{testimonials[currentIndex].role}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-2">
            <button 
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-white transition-colors duration-300 pointer-events-auto"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={handleNext}
              className="w-12 h-12 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-white transition-colors duration-300 pointer-events-auto"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
