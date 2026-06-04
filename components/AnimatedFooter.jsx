"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AnimatedFooter() {
  return (
    <footer className="bg-brand-black border-t border-brand-black/90 pt-24 pb-12 overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-8 mb-24">
          
          {/* Brand */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col items-center md:items-start text-center md:text-left space-y-8">
            <img src="/images/logo-new.png" alt="GRH Fashion Logo" className="h-16 w-auto object-contain opacity-90 brightness-0 invert" />
            <p className="font-inter text-[11px] text-brand-ivory/60 leading-[1.8] max-w-xs">
              Elevating elegance through bespoke couture, intricate embroidery, and unforgettable runway designs.
            </p>
            <div className="flex items-center gap-6 pt-4">
              <a href="https://www.instagram.com/grhfashion_india/" target="_blank" rel="noopener noreferrer" className="font-poppins text-[9px] font-medium tracking-[0.25em] text-brand-ivory hover:text-brand-gold transition-colors duration-500">
                INSTAGRAM
              </a>
              <a href="https://www.facebook.com/people/Grh-Fashion/61587329395625/" target="_blank" rel="noopener noreferrer" className="font-poppins text-[9px] font-medium tracking-[0.25em] text-brand-ivory hover:text-brand-gold transition-colors duration-500">
                FACEBOOK
              </a>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Quick Links */}
          <div className="md:col-span-3 lg:col-span-3 flex flex-col items-center md:items-start space-y-6">
            <h3 className="font-poppins text-[9px] font-medium tracking-[0.3em] uppercase text-brand-gold/60">Discover</h3>
            <div className="flex flex-col space-y-4 items-center md:items-start">
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
                  className="font-inter text-[13px] text-brand-ivory hover:text-brand-gold transition-colors duration-500 relative group inline-block"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-gold transition-all duration-500 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter / Contact Details */}
          <div className="md:col-span-4 lg:col-span-4 flex flex-col items-center md:items-start text-center md:text-left space-y-8">
            <div className="space-y-6 w-full">
              <h3 className="font-poppins text-[9px] font-medium tracking-[0.3em] uppercase text-brand-gold/60">Newsletter</h3>
              <p className="font-inter text-[11px] text-brand-ivory/60 leading-[1.8]">
                Subscribe to receive updates on new collections and exclusive atelier news.
              </p>
              <form className="flex w-full group relative">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full bg-transparent border-b border-brand-ivory/20 px-0 py-3 font-inter text-xs text-brand-ivory focus:outline-none focus:border-brand-ivory placeholder:text-brand-ivory/30 transition-colors duration-500"
                />
                <button type="submit" className="absolute right-0 bottom-3 text-brand-ivory/40 group-hover:text-brand-ivory transition-colors duration-500">
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </form>
            </div>

            <div className="pt-4 space-y-2">
              <h3 className="font-poppins text-[9px] font-medium tracking-[0.3em] uppercase text-brand-gold/60 mb-4">Inquiries</h3>
              <a href="mailto:grhfashion5654@gmail.com" className="block font-inter text-[13px] text-brand-ivory hover:text-brand-gold transition-colors duration-500">grhfashion5654@gmail.com</a>
              <div className="flex gap-3 text-[13px] font-inter text-brand-ivory">
                <a href="tel:+918553643253" className="hover:text-brand-gold transition-colors duration-500">+91 85536 43253</a>
                <span className="text-brand-ivory/20">|</span>
                <a href="tel:+918779259751" className="hover:text-brand-gold transition-colors duration-500">+91 87792 59751</a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-brand-ivory/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-inter text-[10px] uppercase tracking-[0.15em] text-brand-ivory/40">
            &copy; {new Date().getFullYear()} GRH Fashion. All rights reserved.
          </p>
          <div className="flex gap-8 font-inter text-[10px] uppercase tracking-[0.15em] text-brand-ivory/40">
            <Link href="#" className="hover:text-brand-ivory transition-colors duration-500">Privacy Policy</Link>
            <Link href="#" className="hover:text-brand-ivory transition-colors duration-500">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
