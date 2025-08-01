// app/products/page.tsx

import { Metadata } from "next";
import ProductListPage from "../components/productlist";

export async function generateMetadata(): Promise<Metadata> {
  
  return {
    title: "All Products | Tech Element",
    description:
      "Browse a wide variety of tech products including phones, accessories, and more at Tech Element.",
  };
}

export default async function ProductsPage() {
  const res = await fetch("https://fakestoreapi.com/products", {
    next: { revalidate: 60 },
  });
  const products = await res.json();

  return (
    <main>
      <ProductListPage/>
    </main>
  );
}
