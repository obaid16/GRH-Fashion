import LoadingScreen from "@/components/LoadingScreen";
import CinematicHero from "@/components/CinematicHero";
import FashionStory from "@/components/FashionStory";
import RunwayShowcase from "@/components/RunwayShowcase";
import CollectionGrid from "@/components/CollectionGrid";
import CinematicBanner from "@/components/CinematicBanner";
import InstagramLookbook from "@/components/InstagramLookbook";
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

      {/* 2. Fashion Story Split Screen */}
      <FashionStory />

      {/* 3. Horizontal Runway Showcase */}
      <RunwayShowcase />

      {/* 4. Featured Collections Editorial Layout */}
      <section className="py-40 px-6 lg:px-8 max-w-7xl mx-auto bg-brand-ivory">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-6">
          <div className="max-w-3xl">
            <h3 className="text-xs font-poppins text-brand-gold uppercase tracking-[0.3em] mb-6">The Masterpieces</h3>
            <h2 className="text-5xl md:text-7xl font-playfair text-brand-black mb-6 uppercase tracking-wider leading-tight">
              Curated <br/><span className="text-brand-gray italic lowercase font-cormorant">Elegance</span>
            </h2>
          </div>
          <Link href="/collection" className="flex items-center gap-2 text-brand-black font-poppins text-xs uppercase tracking-widest hover:text-brand-gold transition-colors group pb-2 border-b border-brand-black/30 hover:border-brand-gold">
            Explore All Creations <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <CollectionGrid products={featuredProducts} />
      </section>

      {/* 5. The Art of Embroidery (Redesigned with Parallax) */}
      <CinematicBanner />

      {/* 6. Social Campaign */}
      <InstagramLookbook />

      {/* 7. Newsletter */}
      <NewsletterSignup />
    </>
  );
}
