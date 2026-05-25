import Link from "next/link";

export default function CinematicBanner() {
  return (
    <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden my-24">
      {/* Background Video/Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed scale-105"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2000&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-brand-black/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        <h2 className="text-sm font-poppins text-brand-ivory uppercase tracking-[0.3em] mb-6">The Runway Experience</h2>
        <h3 className="text-5xl md:text-7xl font-playfair text-brand-gold mb-8 uppercase tracking-widest leading-tight">
          Redefining <br className="hidden md:block" /> Elegance
        </h3>
        <div className="w-px h-24 bg-brand-gold/50 mb-8"></div>
        <p className="font-cormorant text-2xl md:text-3xl text-brand-ivory italic mb-10">
          "Where every thread tells a story of passion and heritage."
        </p>
        <Link href="/gallery" className="inline-block border border-brand-gold bg-brand-gold/10 backdrop-blur-sm text-brand-gold px-10 py-4 font-poppins text-xs uppercase tracking-widest hover:bg-brand-gold hover:text-white transition-all duration-300">
          Explore The Lookbook
        </Link>
      </div>
    </section>
  );
}
