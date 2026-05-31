"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Consultation & Design",
    description: "We begin with a personal consultation to understand your vision, sketching initial concepts that blend your desires with our signature style."
  },
  {
    num: "02",
    title: "Fabric & Embellishment Selection",
    description: "Choosing from our curated archive of premium silks, tulles, and crystals, we select materials that perfectly complement the design."
  },
  {
    num: "03",
    title: "Artisanal Craftsmanship",
    description: "Our master tailors and embroiderers dedicate hundreds of hours, translating the design into a tangible masterpiece with meticulous attention to detail."
  },
  {
    num: "04",
    title: "Fittings & Final Touches",
    description: "Through precise fittings, we sculpt the garment to your silhouette, ensuring a flawless fit and an unforgettable final reveal."
  }
];

export default function ProcessTimeline() {
  return (
    <section className="py-16 md:py-32 bg-brand-ivory relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="text-center mb-12 md:mb-24 max-w-3xl mx-auto">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-xs font-poppins text-brand-gold uppercase tracking-[0.3em] mb-4"
          >
            Our Process
          </motion.h3>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-playfair text-brand-black uppercase tracking-wider leading-tight"
          >
            The Journey of <span className="text-brand-gray italic lowercase font-cormorant">Creation</span>
          </motion.h2>
        </div>

        <div className="relative">
          {/* Vertical Line for Desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-brand-gold/30 -translate-x-1/2"></div>
          
          <div className="space-y-16 md:space-y-0">
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={idx} className={`relative flex flex-col md:flex-row items-center md:h-64 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  
                  {/* Content Area */}
                  <div className={`md:w-1/2 flex flex-col ${isEven ? 'md:pr-24 md:items-end md:text-right' : 'md:pl-24 md:items-start md:text-left'} text-center items-center`}>
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                      <span className="font-playfair text-6xl text-brand-gold/20 block mb-4">{step.num}</span>
                      <h4 className="font-playfair text-2xl text-brand-black mb-4">{step.title}</h4>
                      <p className="font-inter text-sm text-brand-gray leading-relaxed max-w-md">
                        {step.description}
                      </p>
                    </motion.div>
                  </div>

                  {/* Center Node */}
                  <div className="absolute left-1/2 top-0 md:top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-brand-gold border-4 border-brand-ivory hidden md:block z-10 shadow-[0_0_15px_rgba(168,124,30,0.5)]"></div>

                  {/* Empty space for layout */}
                  <div className="hidden md:block md:w-1/2"></div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
