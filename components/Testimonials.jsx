"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

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
  return (
    <section className="py-24 bg-brand-cream relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-playfair text-brand-black mb-4">Client Stories</h2>
          <div className="w-12 h-px bg-brand-purple mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              className="relative p-8 border border-brand-gold/20 bg-white hover:border-brand-gold/40 shadow-sm hover:shadow-md transition-all duration-500"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-brand-gold/20" />
              <p className="font-cormorant text-lg md:text-xl text-brand-gray leading-relaxed italic mb-8 relative z-10">
                "{t.text}"
              </p>
              <div>
                <h4 className="font-playfair text-brand-black text-lg">{t.name}</h4>
                <p className="font-poppins text-xs uppercase tracking-widest text-brand-gray/70 mt-1">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
