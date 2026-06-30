import mongoose from "mongoose";

const HomepageSchema = new mongoose.Schema(
  {
    hero: {
      heading: { type: String, default: "The Art Of Elegance" },
      subheading: { type: String, default: "Collection 2026" },
      description: {
        type: String,
        default: "Discover the pinnacle of luxury couture, blending timeless silhouettes with masterful, hand-crafted embroidery tailored for the modern muse.",
      },
      backgroundImage: { type: String, default: "/images/replacement-62.png" },
      ctaText: { type: String, default: "Explore Collection" },
      ctaLink: { type: String, default: "/collection" },
      quote: { type: String, default: '"True luxury requires genuine materials and the craftsman\'s sincerity."' },
      author: { type: String, default: "GRH Atelier" },
    },
    whyChooseUs: {
      heading: { type: String, default: "The House of GRH" },
      subheading: { type: String, default: "Our Philosophy" },
      description: { type: String, default: "At GRH Fashion, we blend time-honored techniques with contemporary design." },
      items: [
        {
          title: { type: String },
          description: { type: String },
          icon: { type: String }, // e.g. "Shield", "Star", "Sparkles"
        },
      ],
    },
    latestCollection: {
      heading: { type: String, default: "Curated Elegance" },
      subheading: { type: String, default: "The Masterpieces" },
      linkText: { type: String, default: "Explore All Creations" },
      linkUrl: { type: String, default: "/collection" },
    },
    artOfEmbroidery: {
      heading: { type: String, default: "The Art of Embroidery" },
      description: { type: String, default: "Every stitch tells a story of dedication, precision, and heritage." },
      image: { type: String, default: "/images/replacement-61.png" },
      ctaText: { type: String, default: "The Atelier Story" },
      ctaLink: { type: String, default: "/about" },
    },
    instagramFeed: {
      heading: { type: String, default: "Follow Our Journey" },
      username: { type: String, default: "@grh_fashion" },
      images: { type: [String], default: [] },
    },
    testimonials: [
      {
        name: String,
        role: String,
        content: String,
        rating: { type: Number, default: 5 },
        avatar: String,
      },
    ],
    brandLogos: {
      type: [String],
      default: ["GRH Couture", "GRH Bridal", "GRH Atelier", "GRH Embroidery"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Homepage || mongoose.model("Homepage", HomepageSchema);
