// src/app/(main)/layout.tsx or src/app/layout.tsx
import "@/styles/globals.css";
import Footer from "@/app/components/shared/Footer";
import Navbar from "@/app/components/shared/Navbar";
import { Toaster } from "sonner";
import Providers from "@/providers/ReduxProvider";

export const metadata = {
  title: "Your Site Title",
  description: "Your site description here",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">
        <Providers>
          <>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Toaster />
          </>
        </Providers>
      </body>
    </html>
  );
}
