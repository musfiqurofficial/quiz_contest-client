// app/layout.tsx

import Providers from "@/providers/ReduxProvider";
import "../style/global.css";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
          <Toaster richColors position="top-right" />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
