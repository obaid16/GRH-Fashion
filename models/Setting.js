import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    websiteName: { type: String, default: "GRH Fashion" },
    logo: { type: String, default: "/images/logo-new.png" },
    favicon: { type: String, default: "/favicon.ico" },
    primaryColor: { type: String, default: "#AC8D5D" }, // Gold
    secondaryColor: { type: String, default: "#0F0E0E" }, // Black
    socialLinks: {
      instagram: { type: String, default: "https://instagram.com" },
      facebook: { type: String, default: "https://facebook.com" },
      pinterest: { type: String, default: "https://pinterest.com" },
      whatsapp: { type: String, default: "https://wa.me" },
    },
    contactDetails: {
      email: { type: String, default: "atelier@grhfashion.com" },
      phone: { type: String, default: "+91 99999 99999" },
      address: { type: String, default: "101, Luxury Boulevard, New Delhi, India" },
      googleMapEmbed: { type: String, default: "" },
    },
    seoDefaults: {
      title: { type: String, default: "GRH Fashion | Luxury Couture" },
      description: { type: String, default: "Experience the pinnacle of luxury couture and exquisite hand-crafted embroidery." },
      keywords: { type: [String], default: ["luxury", "fashion", "couture", "bridal", "embroidery"] },
    },
    smtp: {
      host: { type: String, default: "" },
      port: { type: Number, default: 587 },
      user: { type: String, default: "" },
      password: { type: String, default: "" },
    },
    paymentKeys: {
      razorpayKeyId: { type: String, default: "" },
      razorpayKeySecret: { type: String, default: "" },
      stripePublicKey: { type: String, default: "" },
      stripeSecretKey: { type: String, default: "" },
    },
    shippingCharges: { type: Number, default: 0 },
    taxPercentage: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
  },
  { timestamps: true }
);

export default mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
