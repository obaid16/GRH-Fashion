import { getCategories } from "@/actions/category";
import { getCollections } from "@/actions/collection";
import ProductsClient from "./ProductsClient";

export const metadata = {
  title: "Products Portfolio Manager | GRH Admin",
};

export default async function ProductsAdminPage() {
  const [categories, collections] = await Promise.all([
    getCategories(),
    getCollections(),
  ]);

  return (
    <ProductsClient
      categories={categories}
      collections={collections}
    />
  );
}
