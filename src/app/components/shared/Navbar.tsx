"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "হোম", href: "/" },
  { label: "নিয়মবলি", href: "/rules" },
  { label: "ফলাফল", href: "/result" },
  { label: "জিঙ্গাসা", href: "/ask-question" },
];

export default function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="border-b bg-white/40 backdrop-blur-md shadow-sm fixed top-0 w-full z-50">
        <div className="container max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold text-blue-700 hover:text-[#f25b29] transition-colors"
          >
            কুইজ প্রতিযোগিতা
          </Link>

          <nav className="hidden md:flex gap-8 items-center ">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-800 text-lg hover:text-gray-800 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex gap-8 items-center ">
            <Link href="/auth">
              <Button className="ml-4 px-5 py-2 rounded-xl bg-[#f25b29] hover:bg-[#f25b29] text-white shadow">
                লগইন
              </Button>
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-3">
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

        {/* Mobile Drawer with animation */}
        <div
          className={`fixed inset-0 z-[1054] bg-black/30 backdrop-blur-sm h-screen transition-opacity duration-300 ${
            isMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setMenuOpen(false)}
          aria-hidden={!isMenuOpen}
        >
          <aside
            className={`w-72 bg-white h-full p-6 flex flex-col gap-6 shadow-lg rounded-r-xl transform transition-transform duration-300
              ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
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
                কুইজ প্রতিযোগিতা
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
                  className="text-gray-800 hover:text-[#f25b29] text-base font-medium transition"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      </header>
    </>
  );
}
