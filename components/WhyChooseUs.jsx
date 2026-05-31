"use client";

import { motion } from "framer-motion";
import { Scissors, Sparkles, Gem, Clock } from "lucide-react";

const features = [
  {
    icon: <Scissors className="w-8 h-8 text-brand-gold" />,
    title: "Bespoke Tailoring",
    description: "Every piece is crafted to your exact measurements, ensuring a flawless silhouette that celebrates your unique form."
  },
  {
    icon: <Sparkles className="w-8 h-8 text-brand-gold" />,
    title: "Exquisite Hand Embroidery",
    description: "Our artisans dedicate hundreds of hours to intricate beadwork and thread art, creating wearable masterpieces."
  },
  {
    icon: <Gem className="w-8 h-8 text-brand-gold" />,
    title: "Premium Fabrics",
    description: "We source only the finest silks, velvets, and laces globally to ensure an uncompromising luxury feel."
  },
  {
    icon: <Clock className="w-8 h-8 text-brand-gold" />,
    title: "Timeless Design",
    description: "Blending contemporary aesthetics with classic heritage, our creations are designed to be cherished for generations."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function WhyChooseUs() {
  return (
    <section className="py-32 bg-brand-black text-brand-ivory relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-xs font-poppins text-brand-gold uppercase tracking-[0.3em] mb-4"
          >
            The GRH Difference
          </motion.h3>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-playfair uppercase tracking-wider leading-tight"
          >
            Crafting <span className="text-brand-gold italic lowercase font-cormorant">Perfection</span>
          </motion.h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          {features.map((feature, idx) => (
            <motion.div key={idx} variants={itemVariants} className="group flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full border border-brand-gold/30 flex items-center justify-center mb-8 group-hover:bg-brand-gold/10 group-hover:border-brand-gold transition-all duration-500">
                {feature.icon}
              </div>
              <h4 className="font-playfair text-xl tracking-wide mb-4 text-brand-pearl">{feature.title}</h4>
              <p className="font-inter text-sm text-brand-ivory/60 leading-relaxed group-hover:text-brand-ivory/90 transition-colors duration-500">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Counters / Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-32 pt-16 border-t border-brand-ivory/10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <div>
            <div className="font-playfair text-4xl md:text-5xl text-brand-gold mb-2">10+</div>
            <div className="font-poppins text-[10px] uppercase tracking-widest text-brand-ivory/50">Years of Legacy</div>
          </div>
          <div>
            <div className="font-playfair text-4xl md:text-5xl text-brand-gold mb-2">5k+</div>
            <div className="font-poppins text-[10px] uppercase tracking-widest text-brand-ivory/50">Happy Brides</div>
          </div>
          <div>
            <div className="font-playfair text-4xl md:text-5xl text-brand-gold mb-2">100%</div>
            <div className="font-poppins text-[10px] uppercase tracking-widest text-brand-ivory/50">Handcrafted</div>
          </div>
          <div>
            <div className="font-playfair text-4xl md:text-5xl text-brand-gold mb-2">Global</div>
            <div className="font-poppins text-[10px] uppercase tracking-widest text-brand-ivory/50">Shipping</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
