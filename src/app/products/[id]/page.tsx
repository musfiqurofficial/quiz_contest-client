import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Product } from "@/types/product";
import Image from "next/image";
import { AddToCartButton } from "@/app/components/addToCard";

// Define a single Props interface
interface Props {
  params: Promise<{
    id: string;
  }>;
}

// Generate metadata for the page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return { title: "Product Not Found" };
    }

    const product: Product = await res.json();

    return {
      title: `${product.title} | MyStore`,
      description: product.description.slice(0, 150),
    };
  } catch (error) {
    console.error("Error fetching product metadata:", error);
    return { title: "Product Error" };
  }
}

// Product detail page component
export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) return notFound();

  const product: Product = await res.json();

  return (
    <main className="max-w-7xl bg-white mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Product Image */}
        <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-4 flex justify-center">
          <Image
            src={product.image}
            alt={product.title}
            width={400}
            height={400}
            className="object-contain max-h-96"
            priority
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6 px-2">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {product.title}
          </h1>

          <p className="text-xl font-semibold text-indigo-600">
            ${product.price}
          </p>

          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          <div>
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </main>
  );
}
