import LoadingScreen from "@/components/LoadingScreen";
import CinematicHero from "@/components/CinematicHero";
import BrandShowcase from "@/components/BrandShowcase";
import CollectionGrid from "@/components/CollectionGrid";
import WhyChooseUs from "@/components/WhyChooseUs";
import ProcessTimeline from "@/components/ProcessTimeline";
import FashionGallery from "@/components/FashionGallery";
import Testimonials from "@/components/Testimonials";
import CinematicBanner from "@/components/CinematicBanner";
import InstagramLookbook from "@/components/InstagramLookbook";
import FaqSection from "@/components/FaqSection";
import NewsletterSignup from "@/components/NewsletterSignup";
import content from "@/data/content.json";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const featuredProducts = content.products.slice(0, 3);

  return (
    <>
      <LoadingScreen />
      
      {/* 1. Immersive Hero */}
      <CinematicHero />

      {/* 2. Brand Showcase (Marquee) */}
      <BrandShowcase />

      {/* 3. Featured Collections */}
      <section className="py-16 md:py-32 px-6 lg:px-8 max-w-7xl mx-auto bg-brand-ivory relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 md:mb-20 gap-6 text-center md:text-left">
          <div className="max-w-3xl">
            <h3 className="text-xs font-poppins text-brand-gold uppercase tracking-[0.3em] mb-4">The Masterpieces</h3>
            <h2 className="text-5xl md:text-7xl font-playfair text-brand-black mb-4 uppercase tracking-wider leading-tight">
              Curated <br/><span className="text-brand-gray italic lowercase font-cormorant">Elegance</span>
            </h2>
          </div>
          <Link href="/collection" className="flex items-center justify-center md:justify-start gap-2 text-brand-black font-poppins text-xs uppercase tracking-widest hover:text-brand-gold transition-colors group pb-2 border-b border-brand-black/30 hover:border-brand-gold">
            Explore All Creations <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <CollectionGrid products={featuredProducts} />
      </section>

      {/* 4. Why Choose Us */}
      <WhyChooseUs />

      {/* 5. Our Process */}
      <ProcessTimeline />

      {/* 6. Cinematic Banner (The Art of Embroidery) */}
      <CinematicBanner />

      {/* 7. Gallery (Preview) */}
      <section className="py-12 md:py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <h3 className="text-xs font-poppins text-brand-gold uppercase tracking-[0.3em] mb-4">A Glimpse</h3>
          <h2 className="text-4xl md:text-5xl font-playfair text-brand-black uppercase tracking-wider mb-6">
            The <span className="text-brand-gray italic lowercase font-cormorant">Archive</span>
          </h2>
        </div>
        <FashionGallery images={content.gallery.slice(0, 6)} />
        <div className="mt-12 text-center">
          <Link href="/gallery" className="inline-flex items-center gap-2 text-brand-black font-poppins text-xs uppercase tracking-widest hover:text-brand-gold transition-colors group pb-2 border-b border-brand-black/30 hover:border-brand-gold">
            View Full Gallery <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 8. Testimonials */}
      <Testimonials />

      {/* 9. FAQ Section */}
      <FaqSection />

      {/* 10. Social Campaign */}
      <InstagramLookbook />

      {/* 11. Newsletter / Contact */}
      <NewsletterSignup />
    </>
  );
}
