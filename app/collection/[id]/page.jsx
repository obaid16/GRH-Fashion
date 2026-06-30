import content from "@/data/content.json";
import LuxuryButton from "@/components/LuxuryButton";
import { notFound } from "next/navigation";
import Link from "next/link";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function generateStaticParams() {
  try {
    await connectDB();
    const products = await Product.find({ status: "Published" });
    if (products.length > 0) {
      return products.map((product) => ({
        id: product.slug,
      }));
    }
  } catch (err) {
    console.error("Static params generation failed, falling back to JSON:", err);
  }
  return content.products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductDetailsPage({ params }) {
  const resolvedParams = await params;
  
  await connectDB();
  let product = null;
  
  try {
    const dbProduct = await Product.findOne({ slug: resolvedParams.id });
    if (dbProduct) {
      product = {
        id: dbProduct.slug,
        name: dbProduct.name,
        category: dbProduct.category,
        image: dbProduct.thumbnail || dbProduct.images[0] || "/images/logo-new.png",
        description: dbProduct.description,
        materials: dbProduct.tags && dbProduct.tags.length > 0 ? dbProduct.tags : [dbProduct.fabric || "Premium Silk"],
      };
    }
  } catch (err) {
    console.error("Error querying product details:", err);
  }

  if (!product) {
    const fallback = content.products.find((p) => p.id === resolvedParams.id);
    if (fallback) {
      product = fallback;
    } else {
      notFound();
    }
  }

  return (
    <div className="pt-32 pb-24 px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Product Image */}
        <div className="aspect-[3/4] bg-brand-pearl relative overflow-hidden group shadow-sm">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center space-y-8">
          <div>
            <p className="font-poppins text-xs uppercase tracking-[0.2em] text-brand-gray mb-2">{product.category}</p>
            <h1 className="text-4xl md:text-5xl font-playfair text-brand-black mb-4 leading-tight">{product.name}</h1>
            <p className="font-poppins text-sm tracking-widest uppercase text-brand-gold font-medium">Bespoke & Made to Order</p>
          </div>

          <div className="w-12 h-px bg-brand-gold/30"></div>

          <p className="font-inter text-brand-gray leading-relaxed">
            {product.description}
          </p>

          <div>
            <h3 className="font-poppins text-xs uppercase tracking-widest text-brand-gray mb-4">Materials & Details</h3>
            <ul className="list-disc list-inside font-inter text-sm text-brand-gray space-y-2">
              {product.materials.map((mat, i) => (
                <li key={i}>{mat}</li>
              ))}
            </ul>
          </div>

          <div className="pt-8 flex flex-col gap-4">
            <Link href="/custom-design">
              <LuxuryButton variant="solid" className="w-full justify-center">Inquire About This Design</LuxuryButton>
            </Link>
            <p className="text-center font-inter text-xs text-brand-gray/70">Crafted on request. Estimated timeline 6-8 weeks.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
