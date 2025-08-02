import type { Metadata } from "next";
import Banner from "./components/banner";
import HomePage from "./home/page";
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Home | Tech Element",
    description:
      "Browse a wide variety of Cosmetics products including phones, accessories, and more at Tech Element.",
  };
}
export default async function Home() {
  return (
    <>
      <Banner />
      <HomePage />
    </>
  );
}
