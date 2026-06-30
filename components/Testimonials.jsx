"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

export default function Testimonials({ testimonialsList }) {
  const resolvedTestimonials = testimonialsList && testimonialsList.length > 0
    ? testimonialsList
    : testimonials;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % resolvedTestimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [resolvedTestimonials]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    })
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % resolvedTestimonials.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + resolvedTestimonials.length) % resolvedTestimonials.length);
  };

  return (
    <section className="py-24 md:py-40 bg-brand-purple relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          
          <div className="lg:col-span-4 flex flex-col justify-center">
            <h2 className="text-[10px] md:text-xs font-poppins text-brand-gold uppercase tracking-[0.4em] mb-6">
              Client Stories
            </h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-playfair text-brand-ivory uppercase tracking-wider leading-[1.1] mb-8">
              Voices of <br/>
              <span className="text-brand-gray italic lowercase font-cormorant">Elegance</span>
            </h3>
            
            <div className="flex gap-4">
              <button 
                onClick={handlePrev}
                className="w-10 h-10 border border-brand-ivory/20 flex items-center justify-center text-brand-ivory hover:bg-brand-ivory hover:text-brand-purple transition-all duration-500"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={1} />
              </button>
              <button 
                onClick={handleNext}
                className="w-10 h-10 border border-brand-ivory/20 flex items-center justify-center text-brand-ivory hover:bg-brand-ivory hover:text-brand-purple transition-all duration-500"
              >
                <ChevronRight className="w-4 h-4" strokeWidth={1} />
              </button>
            </div>
          </div>

          <div className="lg:col-span-8 relative h-[300px] md:h-[250px] flex items-center">
            <AnimatePresence initial={false} custom={direction}>
              {resolvedTestimonials.length > 0 && (
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 200, damping: 30 },
                    opacity: { duration: 0.8 }
                  }}
                  className="absolute w-full"
                >
                  <div className="w-12 h-[1px] bg-brand-gold mb-8"></div>
                  <p className="font-cormorant text-3xl md:text-5xl text-brand-ivory leading-[1.3] italic mb-10 max-w-3xl">
                    "{resolvedTestimonials[currentIndex].text || resolvedTestimonials[currentIndex].content}"
                  </p>
                  <div className="flex items-center gap-6">
                    <div className="w-8 h-[1px] bg-brand-ivory/30"></div>
                    <div>
                      <h4 className="font-poppins text-xs font-medium uppercase tracking-[0.2em] text-brand-ivory mb-1">
                        {resolvedTestimonials[currentIndex].name}
                      </h4>
                      <p className="font-inter text-[10px] uppercase tracking-[0.15em] text-brand-gray">
                        {resolvedTestimonials[currentIndex].role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
