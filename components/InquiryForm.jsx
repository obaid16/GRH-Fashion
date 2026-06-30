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
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let fileUrl = "";
      if (file) {
        const uploadData = new FormData();
        uploadData.append("file", file);
        const { uploadFileToCloudinary } = await import("@/actions/upload");
        const result = await uploadFileToCloudinary(uploadData);
        fileUrl = result.url;
      }

      // Import the order creation server action
      const { createOrder } = await import("@/actions/order");

      // Submit custom inquiry to MongoDB
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: "Requested Online Commission",
        items: [
          {
            name: "Bespoke Couture Custom Commission",
            price: 65000, // Placeholder base price
            quantity: 1,
            size: formData.measurements || "Custom Fit",
            color: "Custom Selected",
            image: fileUrl || "/images/logo-new.png"
          }
        ],
        discountAmount: 0
      };

      const result = await createOrder(payload);

      if (result.success) {
        alert("Inquiry submitted successfully to GRH Atelier. We will contact you soon.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          measurements: "",
          designDescription: "",
        });
        setFile(null);
      } else {
        throw new Error(result.error || "Failed to submit inquiry");
      }
    } catch (error) {
      console.error(error);
      alert("There was an error submitting your inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
        <label htmlFor="file-upload" className="block border border-dashed border-brand-gold/50 bg-white/30 p-8 text-center cursor-pointer hover:border-brand-purple transition-colors group">
          {file ? (
            <p className="font-inter text-sm text-brand-purple">{file.name}</p>
          ) : (
            <p className="font-inter text-sm text-brand-gray/70 group-hover:text-brand-purple transition-colors">Click to upload reference design or sketch (Optional)</p>
          )}
          <input 
            id="file-upload"
            type="file" 
            className="hidden" 
            accept="image/*,.pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>
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
        <LuxuryButton type="submit" variant="solid" className="w-full md:w-auto" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Inquiry"}
        </LuxuryButton>
      </div>
    </form>
  );
}
