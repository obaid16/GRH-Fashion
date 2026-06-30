export const dynamic = "force-dynamic";

import LoadingScreen from "@/components/LoadingScreen";
import CinematicHero from "@/components/CinematicHero";
import BrandShowcase from "@/components/BrandShowcase";
import CollectionGrid from "@/components/CollectionGrid";
import WhyChooseUs from "@/components/WhyChooseUs";
import ProcessTimeline from "@/components/ProcessTimeline";
import CinematicBanner from "@/components/CinematicBanner";
import FashionGallery from "@/components/FashionGallery";
import Testimonials from "@/components/Testimonials";
import InstagramLookbook from "@/components/InstagramLookbook";
import FaqSection from "@/components/FaqSection";
import NewsletterSignup from "@/components/NewsletterSignup";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// MongoDB actions and fallbacks
import connectDB from "@/lib/db";
import { ensureAdminAndDbSeeded } from "@/lib/seed";
import { getHomepageData } from "@/actions/homepage";
import { getProducts } from "@/actions/product";
import { getMedia } from "@/actions/media";
import content from "@/data/content.json";

export default async function Home() {
  // Ensure DB is seeded on first load
  await connectDB();
  await ensureAdminAndDbSeeded();

  // Fetch from DB
  const homepageData = await getHomepageData();
  
  // Fetch Featured Products from DB
  let featuredProducts = [];
  const prodRes = await getProducts({ status: "Published", limit: 3 });
  if (prodRes.success && prodRes.products.length > 0) {
    // Map db structure to CollectionGrid expectation
    featuredProducts = prodRes.products.map(p => ({
      id: p.slug,
      name: p.name,
      category: p.category,
      image: p.thumbnail || p.images[0] || "/images/logo-new.png",
      description: p.shortDescription || p.description,
    }));
  } else {
    featuredProducts = content.products.slice(0, 3);
  }

  // Fetch Gallery Images from DB
  let galleryImages = [];
  const mediaRes = await getMedia({ folder: "/" });
  if (mediaRes.success && mediaRes.files.length > 0) {
    galleryImages = mediaRes.files.slice(0, 6).map((file) => ({
      id: file._id,
      title: file.name,
      url: file.url,
      description: "Atelier Piece",
    }));
  } else {
    galleryImages = content.gallery.slice(0, 6);
  }

  return (
    <>
      <LoadingScreen />
      
      {/* 1. Immersive Hero */}
      <CinematicHero content={homepageData?.hero} />
 
      {/* 2. Brand Showcase (Marquee) */}
      <BrandShowcase />
 
      {/* 3. Featured Collections */}
      <section className="py-16 md:py-32 px-6 lg:px-8 max-w-7xl mx-auto bg-brand-ivory relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 md:mb-20 gap-6 text-center md:text-left">
          <div className="max-w-3xl">
            <h3 className="text-xs font-poppins text-brand-gold uppercase tracking-[0.3em] mb-4">
              {homepageData?.latestCollection?.subheading || "The Masterpieces"}
            </h3>
            <h2 className="text-5xl md:text-7xl font-playfair text-brand-black mb-4 uppercase tracking-wider leading-tight">
              {homepageData?.latestCollection?.heading.includes("Elegance") ? (
                <>
                  Curated <br/><span className="text-brand-gray italic lowercase font-cormorant">Elegance</span>
                </>
              ) : homepageData?.latestCollection?.heading || "Curated Elegance"}
            </h2>
          </div>
          <Link href={homepageData?.latestCollection?.linkUrl || "/collection"} className="flex items-center justify-center md:justify-start gap-2 text-brand-black font-poppins text-xs uppercase tracking-widest hover:text-brand-gold transition-colors group pb-2 border-b border-brand-black/30 hover:border-brand-gold">
            {homepageData?.latestCollection?.linkText || "Explore All Creations"} <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
 
        <CollectionGrid products={featuredProducts} />
      </section>
 
      {/* 4. Why Choose Us */}
      <WhyChooseUs content={homepageData?.whyChooseUs} />
 
      {/* 5. Our Process */}
      <ProcessTimeline />
 
      {/* 6. Cinematic Banner (The Art of Embroidery) */}
      <CinematicBanner content={homepageData?.artOfEmbroidery} />
 
      {/* 7. Gallery (Preview) */}
      <section className="py-12 md:py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <h3 className="text-xs font-poppins text-brand-gold uppercase tracking-[0.3em] mb-4">A Glimpse</h3>
          <h2 className="text-4xl md:text-5xl font-playfair text-brand-black uppercase tracking-wider mb-6">
            The <span className="text-brand-gray italic lowercase font-cormorant">Archive</span>
          </h2>
        </div>
        <FashionGallery images={galleryImages} />
        <div className="mt-12 text-center">
          <Link href="/gallery" className="inline-flex items-center gap-2 text-brand-black font-poppins text-xs uppercase tracking-widest hover:text-brand-gold transition-colors group pb-2 border-b border-brand-black/30 hover:border-brand-gold">
            View Full Gallery <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>
 
      {/* 8. Testimonials */}
      <Testimonials testimonialsList={homepageData?.testimonials} />
 
      {/* 9. FAQ Section */}
      <FaqSection />
 
      {/* 10. Social Campaign */}
      <InstagramLookbook images={homepageData?.instagramFeed?.images || []} />
 
      {/* 11. Newsletter / Contact */}
      <NewsletterSignup />
    </>
  );
}
