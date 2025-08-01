import type { Product } from "@/types/product";
import ProductCard from "./components/products";

export default async function HomePage() {
  const res = await fetch("https://fakestoreapi.com/products");
  const products = await res.json();
  return (
    <main className="p-4 bg-white w-full max-w-7xl mx-auto py-10 sm:py-20">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((items: Product) => (
          <ProductCard key={items.id} product={items} />
        ))}
      </div>
    </main>
  );
}
