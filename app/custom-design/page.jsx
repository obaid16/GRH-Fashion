import InquiryForm from "@/components/InquiryForm";
import Image from "next/image";

export const metadata = {
  title: "Custom Design Inquiry | GRH Fashion",
};

const referenceImages = [
  "/images/floral-embroidered-dress.png",
  "/images/golden-gown.jpg",
  "/images/velvet-embroidery-maroon.jpg",
  "/images/crystal-embroidery.jpg",
];

export default function CustomDesignPage() {
  return (
    <div className="pt-32 pb-24 px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-playfair text-brand-gold mb-6 uppercase tracking-widest">Bespoke Couture</h1>
        <div className="w-16 h-px bg-brand-purple mx-auto mb-8"></div>
        <p className="font-inter text-brand-gray leading-relaxed max-w-2xl mx-auto">
          Commission a unique masterpiece. From initial sketches to final embroidery, our artisans will bring your vision to life. Please provide as much detail as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Reference Images Gallery */}
        <div className="space-y-6">
          <div className="text-center lg:text-left">
            <h3 className="text-xs font-poppins text-brand-gold uppercase tracking-[0.2em] mb-2">Inspiration Board</h3>
            <p className="text-brand-gray/80 text-sm font-inter">Explore our signature styles and refer to these aesthetics when describing your dream outfit.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {referenceImages.map((src, index) => (
              <div key={index} className="relative h-48 md:h-64 overflow-hidden group">
                <div className="absolute inset-0 bg-brand-black/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img 
                  src={src} 
                  alt={`Reference Design ${index + 1}`} 
                  className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-700"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-brand-pearl p-8 md:p-12 border border-brand-gold/20 relative shadow-sm">
          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-brand-gold/50"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-brand-gold/50"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-brand-gold/50"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-brand-gold/50"></div>
          
          <InquiryForm />
        </div>
      </div>
    </div>
  );
}
