"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CartDrawer from "../components/cart";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Orders", href: "/orders" },
];

export default function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const totalItems = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setCartOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="border-b bg-white/40 backdrop-blur-md shadow-sm fixed top-0 w-full z-50">
        <div className="container max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            className="text-2xl font-bold text-blue-700 hover:text-[#f25b29] transition-colors"
          >
            Tech Element
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-blue-600 text-lg hover:text-blue-600 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Cart Icon with Badge */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
              className="relative hover:border-[#f25b29]"
            >
              <ShoppingCart className="w-5 h-5 text-[#f25b29]" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#f25b29] text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-md">
                  {totalItems}
                </span>
              )}
            </Button>

            <Button className="ml-4 px-5 py-2 rounded-xl bg-[#f25b29] hover:bg-[#f25b29] text-white shadow">
              Login
            </Button>
          </nav>

          {/* Mobile Nav Toggle */}
          <div className="md:hidden flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
              className="relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                  {totalItems}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(true)}
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </Button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 z-[1054] bg-black/30 backdrop-blur-sm h-screen"
            onClick={() => setMenuOpen(false)}
          >
            <aside
              className="w-72 bg-white h-full p-6 flex flex-col gap-6 shadow-lg rounded-r-xl transition-transform"
              ref={menuRef}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <div className="flex justify-between items-center mb-2">
                <Link
                  href="/"
                  className="text-xl font-bold text-blue-700"
                  onClick={() => setMenuOpen(false)}
                >
                  Tech Element
                </Link>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="hover:text-red-500 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-blue-600 hover:text-[#f25b29] text-base font-medium transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                <Button
                  className="mt-6 bg-[#f25b29] hover:bg-[#f25b29] text-white rounded-xl shadow w-full"
                  onClick={() => {
                    setCartOpen(true);
                    setMenuOpen(false);
                  }}
                >
                  View Cart
                </Button>

                <Button className="bg-green-600 hover:bg-[#f25b29] text-white rounded-xl shadow w-full mt-2">
                  Get Started
                </Button>
              </nav>
            </aside>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer open={isCartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
