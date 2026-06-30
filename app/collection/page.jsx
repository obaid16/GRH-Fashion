export const dynamic = "force-dynamic";

import CollectionGrid from "@/components/CollectionGrid";
import connectDB from "@/lib/db";
import { getProducts } from "@/actions/product";
import content from "@/data/content.json";

export const metadata = {
  title: "Collection | GRH Fashion",
};

export default async function CollectionPage() {
  await connectDB();
  const res = await getProducts({ status: "Published", limit: 100 });
  
  let products = [];
  if (res.success && res.products.length > 0) {
    products = res.products.map(p => ({
      id: p.slug,
      name: p.name,
      category: p.category,
      image: p.thumbnail || p.images[0] || "/images/logo-new.png",
      description: p.shortDescription || p.description,
    }));
  } else {
    products = content.products;
  }

  return (
    <div className="pt-32 pb-24 px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-playfair text-brand-gold mb-6 uppercase tracking-widest">The Collection</h1>
      </div>

      <CollectionGrid products={products} />
    </div>
  );
}
