import Link from "next/link";
import Image from "next/image";

const categories = [
  { title: "Bridal Couture", image: "https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=1000&auto=format&fit=crop", href: "/collection?category=bridal" },
  { title: "Bespoke Gowns", image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=1000&auto=format&fit=crop", href: "/custom-design" },
  { title: "Pret-a-Porter", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop", href: "/collection?category=pret" },
];

export default function CategoriesSection() {
  return (
    <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto border-t border-brand-gold/20 mt-16">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-playfair text-brand-gold mb-4 uppercase tracking-wider">The <span className="text-brand-gray italic lowercase font-cormorant">Collections</span></h2>
        <div className="w-16 h-px bg-brand-purple mx-auto mb-6"></div>
        <p className="font-inter text-brand-gray">Curated elegance for every magnificent occasion.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat, idx) => (
          <Link href={cat.href} key={idx} className="group relative aspect-[3/4] overflow-hidden block">
            <div className="absolute inset-0 bg-brand-black/20 group-hover:bg-brand-black/40 transition-colors duration-500 z-10"></div>
            <img 
              src={cat.image} 
              alt={cat.title}
              className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="bg-brand-ivory/90 backdrop-blur-md px-8 py-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <h3 className="font-playfair text-xl text-brand-gold uppercase tracking-widest">{cat.title}</h3>
              </div>
            </div>
            <div className="absolute bottom-6 left-0 right-0 text-center z-10 block group-hover:hidden transition-all duration-500">
              <h3 className="font-playfair text-2xl text-white uppercase tracking-widest drop-shadow-md">{cat.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
