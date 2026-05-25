import Link from "next/link";
import LuxuryButton from "@/components/LuxuryButton";

export const metadata = {
  title: "About Us | GRH Fashion",
};

export default function AboutPage() {
  return (
    <div className="pt-32 pb-0">
      <div className="px-6 lg:px-8 max-w-7xl mx-auto mb-20 text-center">
        <h1 className="text-5xl md:text-7xl font-playfair text-brand-gold mb-6 uppercase tracking-widest">Our Story</h1>
        <div className="w-16 h-px bg-brand-purple mx-auto mb-8"></div>
        <p className="font-inter text-brand-gray max-w-2xl mx-auto leading-relaxed">
          Born from a passion for intricate details and grand silhouettes, GRH Fashion has redefined modern luxury couture.
        </p>
      </div>

      <div className="px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-40">
        <div className="aspect-[4/5] bg-brand-pearl shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-brand-gold/10 group-hover:bg-transparent transition-colors duration-700 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1000&auto=format&fit=crop" 
            alt="Intricate details"
            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
          />
        </div>
        <div className="space-y-8">
          <h2 className="text-4xl font-playfair text-brand-black">The Philosophy</h2>
          <p className="font-cormorant text-2xl text-brand-gray italic">
            "Fashion is not just what you wear, it's the art you live in."
          </p>
          <p className="font-inter text-brand-gray leading-relaxed">
            At GRH Fashion, we believe that true luxury lies in the details that others overlook. From the initial sketch to the final embroidered motif, our artisans pour hundreds of hours into creating garments that transcend seasonal trends.
          </p>
          <div className="pt-6 border-t border-brand-gold/20">
            <h3 className="font-poppins text-xs uppercase tracking-widest text-brand-gray mb-4">Our Expertise</h3>
            <ul className="space-y-2 font-inter text-brand-gray">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-gold"></div> Bridal Couture</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-gold"></div> Zardosi & Hand Embroidery</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-gold"></div> Bespoke Gowns</li>
            </ul>
          </div>
        </div>
      </div>

      {/* The Creative Director */}
      <section className="bg-brand-pearl py-32 border-y border-brand-gold/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 space-y-8">
            <h2 className="text-xl font-poppins text-brand-gray uppercase tracking-widest">The Creative Director</h2>
            <h3 className="text-4xl md:text-5xl font-playfair text-brand-gold">Mastering the Art of Elegance</h3>
            <p className="font-inter text-brand-gray leading-relaxed">
              With over a decade of experience in high-end couture, our founder envisioned a brand that brings together the rich heritage of traditional Indian embroidery with the sleek, avant-garde silhouettes of modern global fashion.
            </p>
            <p className="font-inter text-brand-gray leading-relaxed">
              Every collection is a personal narrative, an exploration of textiles, and a celebration of the feminine form.
            </p>
            <img src="/images/signature.png" alt="Signature" className="h-12 opacity-50" />
          </div>
          <div className="order-1 md:order-2 aspect-[3/4] relative overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1549471013-3364d7ce66ea?q=80&w=1000&auto=format&fit=crop" 
              alt="The Designer"
              className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </div>
      </section>

      {/* The Atelier Process */}
      <section className="py-32 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-playfair text-brand-black mb-6 uppercase tracking-wider">The <span className="text-brand-gold italic lowercase font-cormorant">Atelier</span> Process</h2>
          <div className="w-16 h-px bg-brand-purple mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: "01", title: "The Sketch", desc: "Translating your vision and inspiration into precise conceptual drawings." },
            { step: "02", title: "The Fabric", desc: "Sourcing the finest silks, tulles, and organzas from around the world." },
            { step: "03", title: "The Craft", desc: "Hundreds of hours of meticulous hand-embroidery by master artisans." },
            { step: "04", title: "The Fitting", desc: "Tailoring the masterpiece to drape perfectly across your silhouette." }
          ].map((item, idx) => (
            <div key={idx} className="relative p-8 border border-brand-gold/20 bg-brand-ivory hover:bg-brand-pearl transition-colors duration-300 group">
              <div className="text-5xl font-playfair text-brand-gold/20 absolute top-4 right-4 group-hover:text-brand-gold/40 transition-colors">{item.step}</div>
              <h3 className="text-xl font-playfair text-brand-black mb-4 mt-8">{item.title}</h3>
              <p className="font-inter text-sm text-brand-gray leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Values */}
      <section className="py-32 bg-brand-black text-brand-ivory px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-full border border-brand-gold mx-auto flex items-center justify-center text-brand-gold font-playfair text-xl">1</div>
            <h3 className="text-2xl font-playfair text-brand-gold">Heritage Craft</h3>
            <p className="font-inter text-brand-ivory/70 text-sm leading-relaxed">Preserving ancient embroidery techniques by employing generational artisans and celebrating traditional craftsmanship.</p>
          </div>
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-full border border-brand-gold mx-auto flex items-center justify-center text-brand-gold font-playfair text-xl">2</div>
            <h3 className="text-2xl font-playfair text-brand-gold">Modern Silhouettes</h3>
            <p className="font-inter text-brand-ivory/70 text-sm leading-relaxed">Balancing heavy traditional embellishments with sleek, contemporary cuts designed for the modern woman.</p>
          </div>
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-full border border-brand-gold mx-auto flex items-center justify-center text-brand-gold font-playfair text-xl">3</div>
            <h3 className="text-2xl font-playfair text-brand-gold">Sustainable Luxury</h3>
            <p className="font-inter text-brand-ivory/70 text-sm leading-relaxed">Creating timeless heirloom pieces meant to be passed down through generations, rather than fast-fashion trends.</p>
          </div>
        </div>
      </section>

      {/* Grand CTA */}
      <section className="relative py-40 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-fixed bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?q=80&w=2000&auto=format&fit=crop')" }}
        >
          <div className="absolute inset-0 bg-brand-ivory/90 backdrop-blur-sm"></div>
        </div>
        <div className="relative z-10 text-center max-w-2xl px-6">
          <h2 className="text-4xl md:text-5xl font-playfair text-brand-black mb-8 leading-tight">
            Begin Your Couture Journey
          </h2>
          <p className="font-inter text-brand-gray mb-10">
            Visit our studio for a private consultation and let us bring your dream garment to life.
          </p>
          <Link href="/contact">
            <LuxuryButton variant="solid" className="px-12 py-4">
              Book an Appointment
            </LuxuryButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
