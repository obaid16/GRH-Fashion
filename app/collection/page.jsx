import CollectionGrid from "@/components/CollectionGrid";
import content from "@/data/content.json";

export const metadata = {
  title: "Collection | GRH Fashion",
};

export default function CollectionPage() {
  const products = content.products;

  return (
    <div className="pt-32 pb-24 px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-playfair text-brand-gold mb-6 uppercase tracking-widest">The Collection</h1>
      </div>

      <CollectionGrid products={products} />
    </div>
  );
}
