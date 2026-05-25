import HeroSection from "@/components/HeroSection";
import CollectionGrid from "@/components/CollectionGrid";
import Testimonials from "@/components/Testimonials";
import LoadingScreen from "@/components/LoadingScreen";
import content from "@/data/content.json";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const featuredProducts = content.products.slice(0, 3);

  return (
    <>
      <LoadingScreen />
      
      {/* Hero */}
      <HeroSection />

      {/* Featured Collection Section */}
      <section className="py-32 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-playfair text-brand-gold mb-6 uppercase tracking-wider">Latest <br/><span className="text-brand-gray italic lowercase font-cormorant">Arrivals</span></h2>
            <p className="font-inter text-brand-gray leading-relaxed">
              Explore our newest collection of masterfully crafted pieces, where traditional techniques meet contemporary couture.
            </p>
          </div>
          <Link href="/collection" className="flex items-center gap-2 text-brand-gold font-poppins text-xs uppercase tracking-widest hover:text-brand-purple transition-colors group pb-2 border-b border-brand-gold/30 hover:border-brand-purple">
            View All Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <CollectionGrid products={featuredProducts} />
      </section>

      {/* Craftsmanship Banner */}
      <section className="relative py-40 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-fixed bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000&auto=format&fit=crop')" }}
        >
          <div className="absolute inset-0 bg-brand-ivory/80 backdrop-blur-sm"></div>
        </div>
        <div className="relative z-10 text-center max-w-3xl px-6">
          <h2 className="text-3xl md:text-5xl font-playfair text-brand-gold mb-8 leading-tight">
            The Art of <br/> Embroidery
          </h2>
          <p className="font-cormorant text-xl md:text-2xl text-brand-gray italic mb-10">
            "Every stitch is a testament to our dedication to luxury."
          </p>
          <Link href="/custom-design" className="inline-block border border-brand-gold text-brand-gold px-8 py-3 font-poppins text-xs uppercase tracking-widest hover:bg-brand-gold hover:text-white transition-colors">
            Request Custom Design
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />
    </>
  );
}
