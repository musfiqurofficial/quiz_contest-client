import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Product } from "@/types/product";
import Image from "next/image";
import { AddToCartButton } from "@/app/components/addToCard";

interface Props {
  params: { id: string };
}

// ✅ Dynamic Meta Title & Description
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${params.id}`);
    if (!res.ok) return { title: "Product Not Found" };

    const product: Product = await res.json();

    return {
      title: `${product.title} | MyStore`,
      description: product.description.slice(0, 150),
    };
  } catch {
    return { title: "Product Error" };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const res = await fetch(`https://fakestoreapi.com/products/${params.id}`, {
    // Cache as SSG + ISR (revalidate every 60 seconds)
    next: { revalidate: 60 },
  });

  if (!res.ok) return notFound();

  const product: Product = await res.json();

  return (
    <main className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Image
          src={product.image}
          alt={product.title}
          width={400}
          height={400}
          className="object-contain h-auto w-auto"
        />
        <div>
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="text-gray-700 mt-2">${product.price}</p>
          <p className="mt-4">{product.description}</p>
          <AddToCartButton product={product} />
        </div>
      </div>
    </main>
  );
}
