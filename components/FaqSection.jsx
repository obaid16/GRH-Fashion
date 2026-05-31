"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How far in advance should I book my bridal consultation?",
    answer: "We recommend booking your initial consultation 6-8 months prior to your wedding day. This allows ample time for the design process, meticulous embroidery work, and necessary fittings."
  },
  {
    question: "Do you offer international shipping for your couture pieces?",
    answer: "Yes, we ship our creations globally. We use premium, fully insured courier services to ensure your garment arrives in pristine condition, no matter where you are."
  },
  {
    question: "Can I customize an existing design from the collection?",
    answer: "Absolutely. Many of our clients choose to modify silhouettes, necklines, or embroidery details from our current collections to better suit their personal style."
  },
  {
    question: "What is the typical price range for a custom gown?",
    answer: "Our bespoke gowns start at $3,500. The final investment varies significantly based on the complexity of the design, fabric choices, and the intricacy of hand-embroidery."
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-32 bg-brand-pearl">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        
        <div className="text-center mb-20">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-poppins text-brand-gray uppercase tracking-[0.3em] mb-4"
          >
            Inquiries
          </motion.h3>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-playfair text-brand-black uppercase tracking-wider mb-6"
          >
            Curious <span className="text-brand-gold italic lowercase font-cormorant">Minds</span>
          </motion.h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="border-b border-brand-black/10"
              >
                <button 
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full py-6 flex items-center justify-between text-left group"
                >
                  <span className="font-playfair text-xl md:text-2xl text-brand-black group-hover:text-brand-purple transition-colors">
                    {faq.question}
                  </span>
                  <span className="text-brand-gold ml-4 flex-shrink-0">
                    {isOpen ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                  </span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-8 text-brand-gray font-inter text-sm leading-relaxed pr-8">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
