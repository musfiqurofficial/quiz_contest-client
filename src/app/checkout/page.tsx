import type { Metadata } from "next";

import CheckoutList from "../components/checkout";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Checkout | Tech Element",
    description:
      "Browse a wide variety of tech products including phones, accessories, and more at Tech Element.",
  };
}
export default function CheckoutPage() {
  return (
    <>
      <CheckoutList />
    </>
  );
}
