"use client";

import Link from "next/link";
import LuxuryButton from "./LuxuryButton";

export default function AnimatedFooter() {
  return (
    <footer className="bg-brand-cream border-t border-brand-gold/20 pt-20 pb-10 overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-b from-brand-gold/0 via-brand-gold/50 to-brand-gold/0"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Brand */}
          <div className="space-y-6 text-center md:text-left">
            <img src="/images/logo-new.png" alt="GRH Fashion Logo" className="h-24 w-auto object-contain mb-6 mx-auto md:mx-0" />
            <p className="font-inter text-sm text-brand-gray leading-relaxed max-w-xs mx-auto md:mx-0">
              Elevating elegance through bespoke couture, intricate embroidery, and unforgettable runway designs.
              <br/><br/>
              <span className="block font-medium mb-1">Inquiries & Appointments:</span>
              <a href="tel:+918553643253" className="hover:text-brand-purple transition-colors">+91 85536 43253</a>
              <span className="mx-2">|</span>
              <a href="tel:+918779259751" className="hover:text-brand-purple transition-colors">+91 87792 59751</a>
              <br/>
              <a href="mailto:grhfashion5654@gmail.com" className="hover:text-brand-purple transition-colors">grhfashion5654@gmail.com</a>
            </p>
            <div className="flex items-center justify-center md:justify-start gap-6 pt-4">
              <a href="https://www.instagram.com/grhfashion_india/" target="_blank" rel="noopener noreferrer" className="font-poppins text-xs tracking-widest text-brand-gray hover:text-brand-purple transition-colors">
                INSTAGRAM
              </a>
              <a href="https://www.facebook.com/people/Grh-Fashion/61587329395625/" target="_blank" rel="noopener noreferrer" className="font-poppins text-xs tracking-widest text-brand-gray hover:text-brand-purple transition-colors">
                FACEBOOK
              </a>
              <a href="https://www.google.com/search?q=grh+fashion&ie=UTF-8&oe=UTF-8&hl=en-ae&vssid=lcl" target="_blank" rel="noopener noreferrer" className="font-poppins text-xs tracking-widest text-brand-gray hover:text-brand-purple transition-colors">
                LOCATION
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="font-poppins text-xs tracking-[0.2em] uppercase text-brand-gray mb-4">Discover</h3>
            {[
              { name: 'Collection', path: '/collection' },
              { name: 'Custom Design', path: '/custom-design' },
              { name: 'Gallery', path: '/gallery' },
              { name: 'About Us', path: '/about' },
              { name: 'Contact', path: '/contact' }
            ].map((link) => (
              <Link 
                key={link.name} 
                href={link.path}
                className="font-inter text-sm text-brand-gray hover:text-brand-purple transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-purple transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Newsletter */}
          <div className="text-center md:text-left space-y-6">
            <h3 className="font-poppins text-xs tracking-[0.2em] uppercase text-brand-gray">Exclusive Updates</h3>
            <p className="font-inter text-sm text-brand-gray">
              Subscribe to receive updates on new collections and exclusive offers.
            </p>
            <form className="flex flex-col gap-4">
              <input 
                type="email" 
                placeholder="YOUR EMAIL ADDRESS" 
                className="bg-transparent border-b border-brand-gold/50 px-0 py-2 font-inter text-sm text-brand-black focus:outline-none focus:border-brand-purple placeholder:text-brand-gray transition-colors"
              />
              <LuxuryButton variant="primary" className="w-fit self-center md:self-start py-2 px-6">
                Subscribe
              </LuxuryButton>
            </form>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-brand-gold/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <p className="font-inter text-xs text-brand-gray">
            &copy; {new Date().getFullYear()} GRH Fashion. All rights reserved.
          </p>
          <div className="flex gap-6 font-inter text-xs text-brand-gray">
            <Link href="#" className="hover:text-brand-purple transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-brand-purple transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
