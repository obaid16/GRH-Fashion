"use client";

import { useState } from "react";
import LuxuryButton from "./LuxuryButton";

export default function InquiryForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    measurements: "",
    designDescription: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Inquiry submitted:", formData);
    // Submit to backend
    alert("Inquiry submitted successfully. We will contact you soon.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-xs font-poppins uppercase tracking-widest text-brand-gray/80">Full Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-white/60 border-b border-brand-gold/40 pb-3 pt-2 px-2 text-brand-black focus:outline-none focus:border-brand-purple hover:border-brand-gold focus:bg-white/90 transition-all placeholder:text-brand-gray/40 rounded-t-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-poppins uppercase tracking-widest text-brand-gray/80">Email Address</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-white/60 border-b border-brand-gold/40 pb-3 pt-2 px-2 text-brand-black focus:outline-none focus:border-brand-purple hover:border-brand-gold focus:bg-white/90 transition-all placeholder:text-brand-gray/40 rounded-t-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-poppins uppercase tracking-widest text-brand-gray/80">Phone Number</label>
        <input
          type="tel"
          name="phone"
          required
          value={formData.phone}
          onChange={handleChange}
          className="w-full bg-white/60 border-b border-brand-gold/40 pb-3 pt-2 px-2 text-brand-black focus:outline-none focus:border-brand-purple hover:border-brand-gold focus:bg-white/90 transition-all rounded-t-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-poppins uppercase tracking-widest text-brand-gray/80">Reference Images</label>
        <div className="border border-dashed border-brand-gold/50 bg-white/30 p-8 text-center cursor-pointer hover:border-brand-purple transition-colors group">
          <p className="font-inter text-sm text-brand-gray/70 group-hover:text-brand-purple transition-colors">Click to upload reference designs or sketches (Optional)</p>
          <input type="file" multiple className="hidden" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-poppins uppercase tracking-widest text-brand-gray/80">Measurements (if known)</label>
        <textarea
          name="measurements"
          rows={2}
          value={formData.measurements}
          onChange={handleChange}
          className="w-full bg-white/60 border-b border-brand-gold/40 pb-3 pt-2 px-2 text-brand-black focus:outline-none focus:border-brand-purple hover:border-brand-gold focus:bg-white/90 transition-all resize-none rounded-t-sm"
        ></textarea>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-poppins uppercase tracking-widest text-brand-gray/80">Design Description</label>
        <textarea
          name="designDescription"
          required
          rows={4}
          value={formData.designDescription}
          onChange={handleChange}
          className="w-full bg-white/60 border-b border-brand-gold/40 pb-3 pt-2 px-2 text-brand-black focus:outline-none focus:border-brand-purple hover:border-brand-gold focus:bg-white/90 transition-all resize-none rounded-t-sm"
          placeholder="Describe your dream outfit..."
        ></textarea>
      </div>

      <div className="text-center pt-4">
        <LuxuryButton type="submit" variant="solid" className="w-full md:w-auto">
          Submit Inquiry
        </LuxuryButton>
      </div>
    </form>
  );
}
