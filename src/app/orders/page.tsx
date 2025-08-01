import type { Metadata } from "next";
import OrdersList from "../components/orderList";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Order List | Tech Element",
    description:
      "Browse a wide variety of tech products including phones, accessories, and more at Tech Element.",
  };
}
export default function OrdersPage() {
  return (
    <>
      <OrdersList />
    </>
  );
}
