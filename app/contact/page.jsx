import { MapPin, Phone, Mail } from "lucide-react";
import LuxuryButton from "@/components/LuxuryButton";

const InstagramIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const metadata = {
  title: "Private Consultation | GRH Fashion",
};

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-brand-pearl flex flex-col pt-24 lg:pt-0 lg:flex-row overflow-hidden">
      
      {/* Background Cinematic Texture */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay z-0" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

      {/* Left Side: Cinematic Imagery */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-screen relative z-10 flex flex-col justify-end">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/velvet-embroidery-maroon.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-brand-black via-brand-black/90 to-brand-black/20"></div>
        </div>
        
        <div className="relative z-20 p-8 md:p-16 lg:p-24 w-full">
          <div className="w-12 h-px bg-brand-gold mb-6"></div>
          <h3 className="text-xs font-poppins text-brand-gold uppercase tracking-[0.4em] mb-4">The Atelier</h3>
          <h1 className="text-5xl md:text-7xl font-playfair text-brand-ivory uppercase tracking-widest leading-[1.1] mb-12">
            Private <br/><span className="italic font-cormorant text-brand-gold/80 lowercase">Consultation</span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-8 border-t border-brand-ivory/10 pt-8 text-brand-ivory/60 font-inter text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-gold/80 mt-0.5" />
              <p>GRH Fashion Studio<br/>Mumbai, India</p>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-brand-gold/80 mt-0.5" />
              <p>+91 85536 43253<br/>+91 87792 59751</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Glassmorphic Contact Area */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-6 md:p-16 relative z-10">
        
        <div className="w-full max-w-xl bg-white/60 backdrop-blur-2xl border border-brand-gold/20 p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative">
          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-brand-gold"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-brand-gold"></div>

          <h2 className="text-3xl font-playfair text-brand-black mb-8">Request an Appointment</h2>
          
          <form className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-poppins uppercase tracking-[0.2em] text-brand-gold">Your Name</label>
              <input type="text" required className="w-full bg-transparent border-b border-brand-black/20 pb-3 pt-2 text-brand-black focus:outline-none focus:border-brand-gold transition-colors font-inter text-sm placeholder:text-brand-black/30" placeholder="e.g. Isabella Rossi" />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-poppins uppercase tracking-[0.2em] text-brand-gold">Email Address</label>
              <input type="email" required className="w-full bg-transparent border-b border-brand-black/20 pb-3 pt-2 text-brand-black focus:outline-none focus:border-brand-gold transition-colors font-inter text-sm placeholder:text-brand-black/30" placeholder="isabella@example.com" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-poppins uppercase tracking-[0.2em] text-brand-gold">Inquiry Type</label>
              <select required defaultValue="" className="w-full bg-transparent border-b border-brand-black/20 pb-3 pt-2 text-brand-black focus:outline-none focus:border-brand-gold transition-colors font-inter text-sm appearance-none cursor-pointer">
                <option value="" disabled className="bg-white text-brand-black/50">Select a category...</option>
                <option value="bridal" className="bg-white text-brand-black">Bridal Couture</option>
                <option value="bespoke" className="bg-white text-brand-black">Bespoke Evening Gown</option>
                <option value="pret" className="bg-white text-brand-black">Pret-a-Porter Inquiry</option>
                <option value="other" className="bg-white text-brand-black">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-poppins uppercase tracking-[0.2em] text-brand-gold">Message</label>
              <textarea rows={3} required className="w-full bg-transparent border-b border-brand-black/20 pb-3 pt-2 text-brand-black focus:outline-none focus:border-brand-gold transition-colors font-inter text-sm resize-none placeholder:text-brand-black/30" placeholder="Tell us about your vision..."></textarea>
            </div>

            <button type="button" className="w-full group relative px-10 py-4 overflow-hidden border border-brand-gold bg-brand-ivory hover:bg-brand-gold/10 transition-colors duration-500 mt-4">
              <span className="relative z-10 font-poppins text-xs uppercase tracking-widest text-brand-gold">
                Send Request
              </span>
            </button>
          </form>

          {/* Social Links */}
          <div className="mt-12 pt-8 border-t border-brand-black/10 flex justify-between items-center">
            <p className="text-[10px] font-poppins uppercase tracking-[0.2em] text-brand-black/50">Connect Directly</p>
            <div className="flex gap-4">
              <a href="https://instagram.com" className="w-10 h-10 rounded-full border border-brand-black/20 flex items-center justify-center text-brand-black/70 hover:text-white hover:bg-brand-gold hover:border-brand-gold transition-colors">
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a href="mailto:grhfashion5654@gmail.com" className="w-10 h-10 rounded-full border border-brand-black/20 flex items-center justify-center text-brand-black/70 hover:text-white hover:bg-brand-gold hover:border-brand-gold transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
