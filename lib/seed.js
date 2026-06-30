import connectDB from "./db";
import Admin from "../models/Admin";
import Product from "../models/Product";
import Category from "../models/Category";
import Collection from "../models/Collection";
import Setting from "../models/Setting";
import Homepage from "../models/Homepage";
import content from "../data/content.json";
import bcrypt from "bcryptjs";

export async function ensureAdminAndDbSeeded() {
  await connectDB();

  // 1. Seed Super Admin if none exists
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    console.log("No admins found. Seeding default Super Admin...");
    const hashedPassword = await bcrypt.hash("admin12345", 10);
    await Admin.create({
      name: "Super Admin",
      email: "admin@grhfashion.com",
      password: hashedPassword,
      role: "Super Admin",
      permissions: ["all"],
    });
    console.log("Super Admin seeded successfully: admin@grhfashion.com / admin12345");
  }

  // 2. Seed Settings if none exist
  const settingsCount = await Setting.countDocuments();
  if (settingsCount === 0) {
    console.log("No settings found. Seeding default Settings...");
    await Setting.create({
      websiteName: "GRH Fashion",
      logo: "/images/logo-new.png",
      favicon: "/favicon.ico",
      primaryColor: "#AC8D5D",
      secondaryColor: "#0F0E0E",
    });
  }

  // 3. Seed Homepage config if none exists
  const homepageCount = await Homepage.countDocuments();
  if (homepageCount === 0) {
    console.log("No homepage layout found. Seeding default Homepage config...");
    
    const whyChooseUsItems = [
      { title: "Bespoke Fitting", description: "Every creation is tailor-made to your exact proportions.", icon: "Scissors" },
      { title: "Heritage Craft", description: "Hand-embellished by traditional master artisans.", icon: "Sparkles" },
      { title: "Premium Fabrics", description: "Only the finest silks, velvets, and imported tulles.", icon: "Crown" }
    ];

    const testimonialsItems = [
      { name: "Aria Sharma", role: "Vogue India Editor", content: "The level of handwork and detail in the crimson cascade gown is absolute couture perfection.", rating: 5, avatar: "/images/replacement-33.jpg" },
      { name: "Meera Oberoi", role: "Bridal Client", content: "My custom bridal gown was a dream. The fit was flawless, and the embroidery took everyone's breath away.", rating: 5, avatar: "/images/replacement-34.jpg" }
    ];

    await Homepage.create({
      hero: {
        heading: "The Art Of Elegance",
        subheading: "Collection 2026",
        description: "Discover the pinnacle of luxury couture, blending timeless silhouettes with masterful, hand-crafted embroidery tailored for the modern muse.",
        backgroundImage: "/images/replacement-62.png",
        ctaText: "Explore Collection",
        ctaLink: "/collection",
        quote: '"True luxury requires genuine materials and the craftsman\'s sincerity."',
        author: "GRH Atelier",
      },
      whyChooseUs: {
        heading: "The House of GRH",
        subheading: "Our Philosophy",
        description: "At GRH Fashion, we blend time-honored techniques with contemporary design.",
        items: whyChooseUsItems,
      },
      latestCollection: {
        heading: "Curated Elegance",
        subheading: "The Masterpieces",
        linkText: "Explore All Creations",
        linkUrl: "/collection",
      },
      artOfEmbroidery: {
        heading: "The Art of Embroidery",
        description: "Every stitch tells a story of dedication, precision, and heritage.",
        image: "/images/replacement-61.png",
        ctaText: "The Atelier Story",
        ctaLink: "/about",
      },
      instagramFeed: {
        heading: "Follow Our Journey",
        username: "@grh_fashion",
        images: [
          "/images/replacement-44.jpg",
          "/images/replacement-50.jpg",
          "/images/replacement-30.jpg",
          "/images/new-batch-2.jpg",
          "/images/new-batch-3.jpg",
          "/images/new-batch-4.jpg"
        ],
      },
      testimonials: testimonialsItems,
      brandLogos: ["GRH Couture", "GRH Bridal", "GRH Atelier", "GRH Embroidery"],
    });
  }

  // 4. Seed Categories if none exist
  const categoryCount = await Category.countDocuments();
  if (categoryCount === 0) {
    console.log("No categories found. Seeding default Categories...");
    const categoriesToSeed = [
      { name: "Fabric Work", slug: "fabric-work", isFeatured: true, image: "/images/replacement-44.jpg" },
      { name: "Couture Gowns", slug: "couture-gowns", isFeatured: true, image: "/images/replacement-62.png" },
      { name: "Bridal Couture", slug: "bridal-couture", isFeatured: true, image: "/images/replacement-61.png" },
      { name: "Embroidery Designs", slug: "embroidery-designs", isFeatured: true, image: "/images/replacement-43.jpg" },
      { name: "Luxury Gowns", slug: "luxury-gowns", isFeatured: true, image: "/images/replacement-40.jpg" }
    ];
    await Category.insertMany(categoriesToSeed);
  }

  // 5. Seed Collections if none exist
  const collectionsCount = await Collection.countDocuments();
  if (collectionsCount === 0) {
    console.log("No collections found. Seeding default Collections...");
    const collectionsToSeed = [
      { name: "Summer Collection", slug: "summer-collection", description: "Breezy and elegant designs for the warm season", image: "/images/replacement-32.jpg", isFeatured: true },
      { name: "Winter Collection", slug: "winter-collection", description: "Lustrous heavy velvets and royal colors", image: "/images/replacement-54.jpg", isFeatured: true },
      { name: "Premium Collection", slug: "premium-collection", description: "Intricately detailed bridal masterpieces", image: "/images/replacement-5.png", isFeatured: true }
    ];
    await Collection.insertMany(collectionsToSeed);
  }

  // 6. Seed Products from content.json if none exist
  const productCount = await Product.countDocuments();
  if (productCount === 0 && content && content.products) {
    console.log(`No products found. Seeding ${content.products.length} products from content.json...`);
    const productsToSeed = content.products.map((p) => {
      // Find or assign pricing
      const price = p.price || 45000; // Default price for mock
      const discount = p.discount || 0;
      return {
        name: p.name,
        slug: p.id || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: p.description,
        shortDescription: p.description.substring(0, 100) + "...",
        category: p.category,
        subCategory: p.materials ? p.materials[0] : "Bespoke",
        collectionName: "Premium Collection",
        price,
        discount,
        finalPrice: price - discount,
        sizes: ["XS", "S", "M", "L", "XL", "Custom Fit"],
        colors: ["Ivory", "Crimson", "Royal Blue", "Emerald", "Maroon"],
        stock: 10,
        gender: "Women",
        fabric: p.materials ? p.materials.join(", ") : "Net Fabric",
        tags: p.materials || [],
        isFeatured: true,
        isNewArrival: true,
        images: [p.image],
        thumbnail: p.image,
        seoTitle: `${p.name} | GRH Couture`,
        seoDescription: p.description,
        status: "Published",
      };
    });

    await Product.insertMany(productsToSeed);
    console.log("Products seeded successfully.");
  }
}
