import LuxuryButton from "./LuxuryButton";

export default function NewsletterSignup() {
  return (
    <section className="py-32 px-6 lg:px-8 max-w-4xl mx-auto text-center">
      <h2 className="text-3xl md:text-5xl font-playfair text-brand-gold mb-6 uppercase tracking-wider">Join The <span className="text-brand-gray italic lowercase font-cormorant">Inner Circle</span></h2>
      <div className="w-16 h-px bg-brand-purple mx-auto mb-8"></div>
      <p className="font-inter text-brand-gray mb-12">
        Subscribe to our newsletter to receive exclusive invitations to trunk shows, early access to new collections, and behind-the-scenes glimpses of our atelier.
      </p>
      
      <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
        <input 
          type="email" 
          placeholder="Enter your email address" 
          required
          className="flex-1 bg-transparent border-b border-brand-gold/50 pb-3 pt-2 px-4 text-brand-black focus:outline-none focus:border-brand-purple hover:border-brand-gold transition-colors placeholder:text-brand-gray/50 font-inter text-sm"
        />
        <LuxuryButton type="button" variant="outline" className="shrink-0 px-8">
          Subscribe
        </LuxuryButton>
      </form>
    </section>
  );
}
