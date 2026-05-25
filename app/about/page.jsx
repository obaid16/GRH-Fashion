import Image from "next/image";

export const metadata = {
  title: "About Us | GRH Fashion",
};

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h1 className="text-5xl md:text-7xl font-playfair text-brand-gold mb-6 uppercase tracking-widest">Our Story</h1>
        <div className="w-16 h-px bg-brand-purple mx-auto mb-8"></div>
        <p className="font-inter text-brand-gray max-w-2xl mx-auto leading-relaxed">
          Born from a passion for intricate details and grand silhouettes, GRH Fashion has redefined modern luxury couture.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
        <div className="aspect-[4/5] bg-brand-pearl shadow-sm relative overflow-hidden">
          <img 
            src="/images/bugle-bead-leaves.jpg" 
            alt="Designer working"
            className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
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
              <li>— Bridal Couture</li>
              <li>— Zardosi & Hand Embroidery</li>
              <li>— Bespoke Gowns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
