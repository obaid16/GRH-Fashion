import { MapPin, Phone, Mail, Clock } from "lucide-react";
import LuxuryButton from "@/components/LuxuryButton";

export const metadata = {
  title: "Contact Us | GRH Fashion",
};

export default function ContactPage() {
  return (
    <div className="pt-32 pb-24 px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-playfair text-brand-gold mb-6 uppercase tracking-widest">Contact</h1>
        <div className="w-16 h-px bg-brand-purple mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Info */}
        <div className="space-y-12">
          <div>
            <h2 className="text-3xl font-playfair text-brand-gold mb-6">Visit Our Boutique</h2>
            <p className="font-inter text-brand-gray leading-relaxed mb-8">
              Experience our luxury couture firsthand. Schedule a private consultation with our head designer to begin your bespoke journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-brand-gold flex-shrink-0" />
                <div>
                  <h4 className="font-poppins text-xs uppercase tracking-widest text-brand-gray/80 mb-1">Location</h4>
                  <p className="font-inter text-sm text-brand-black">GRH Fashion Studio<br/>(Click map below for directions)</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-brand-gold flex-shrink-0" />
                <div>
                  <h4 className="font-poppins text-xs uppercase tracking-widest text-brand-gray/80 mb-1">Hours</h4>
                  <p className="font-inter text-sm text-brand-black">Mon - Fri: 10AM - 7PM<br/>Weekend: By Appointment</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-brand-gold flex-shrink-0" />
                <div>
                  <h4 className="font-poppins text-xs uppercase tracking-widest text-brand-gray/80 mb-1">Phone / WhatsApp</h4>
                  <p className="font-inter text-sm text-brand-black">
                    <a href="tel:+918553643253" className="hover:text-brand-purple">+91 85536 43253</a><br/>
                    <a href="tel:+918779259751" className="hover:text-brand-purple">+91 87792 59751</a>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-brand-gold flex-shrink-0" />
                <div>
                  <h4 className="font-poppins text-xs uppercase tracking-widest text-brand-gray/80 mb-1">Email</h4>
                  <p className="font-inter text-sm text-brand-black">
                    <a href="mailto:grhfashion5654@gmail.com" className="hover:text-brand-purple transition-colors">grhfashion5654@gmail.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps Area */}
          <div className="w-full h-64 bg-brand-ivory border border-brand-gold/20 relative overflow-hidden">
            <iframe
              src="https://maps.google.com/maps?q=grh+fashion&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="GRH Fashion Location"
              className="absolute inset-0 w-full h-full"
            ></iframe>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-brand-pearl p-8 md:p-12 border border-brand-gold/20 relative shadow-sm">
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-brand-gold/50"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-brand-gold/50"></div>
          
          <h3 className="text-2xl font-playfair text-brand-black mb-8">Send a Message</h3>
          
          <form className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-poppins uppercase tracking-widest text-brand-gray/80">Full Name</label>
              <input type="text" required className="w-full bg-white/50 border-b border-brand-gold/50 pb-2 text-brand-black focus:outline-none focus:border-brand-purple transition-colors" />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-poppins uppercase tracking-widest text-brand-gray/80">Email Address</label>
              <input type="email" required className="w-full bg-white/50 border-b border-brand-gold/50 pb-2 text-brand-black focus:outline-none focus:border-brand-purple transition-colors" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-poppins uppercase tracking-widest text-brand-gray/80">Subject</label>
              <input type="text" required className="w-full bg-white/50 border-b border-brand-gold/50 pb-2 text-brand-black focus:outline-none focus:border-brand-purple transition-colors" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-poppins uppercase tracking-widest text-brand-gray/80">Message</label>
              <textarea rows={4} required className="w-full bg-white/50 border-b border-brand-gold/50 pb-2 text-brand-black focus:outline-none focus:border-brand-purple transition-colors resize-none"></textarea>
            </div>

            <LuxuryButton type="button" variant="solid" className="w-full">
              Send Message
            </LuxuryButton>
          </form>
        </div>
      </div>
    </div>
  );
}
