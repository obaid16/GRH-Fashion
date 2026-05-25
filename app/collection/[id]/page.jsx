import content from "@/data/content.json";
import LuxuryButton from "@/components/LuxuryButton";
import { notFound } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
  return content.products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductDetailsPage({ params }) {
  const resolvedParams = await params;
  const product = content.products.find((p) => p.id === resolvedParams.id);

  if (!product) {
    notFound();
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
