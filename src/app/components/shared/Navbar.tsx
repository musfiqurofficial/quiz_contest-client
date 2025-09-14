"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, Home, BookOpen, Trophy, HelpCircle, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutUser, initializeAuth } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { store } from "@/store/store";

const navLinks = [
  { label: "হোম", href: "/", icon: Home },
  { label: "নিয়মবলি", href: "/rules", icon: BookOpen },
  { label: "ফলাফল", href: "/result", icon: Trophy },
  { label: "জিঙ্গাসা", href: "/ask-question", icon: HelpCircle },
];

export default function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  
  const { isAuthenticated } = useSelector((state) => state.auth);
  const user = useSelector(selectCurrentUser);

  // পেজ লোডের সময় অথেনটিকেশন চেক করা
  useEffect(() => {
    store.dispatch(initializeAuth()).then((result) => {
      console.log("Navbar Initialize Auth Result:", result);
    });
  }, [dispatch]);

  // ব্যবহারকারীর তথ্য কনসোল লগ করা
  useEffect(() => {
    console.log("Navbar User Info:", user);
  }, [user]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setProfileOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success('লগআউট সফল হয়েছে');
      setProfileOpen(false);
      router.push('/');
    } catch (error: any) {
      toast.error(error || 'লগআউট করতে সমস্যা হয়েছে');
    }
  };

  return (
    <>
      <header className="border-b bg-white/95 backdrop-blur-md shadow-sm fixed top-0 w-full z-50">
        <div className="container max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            কুইজ প্রতিযোগিতা
          </Link>
          
          <nav className="hidden md:flex gap-6 items-center">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-indigo-50"
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 rounded-full px-3 py-2 hover:bg-indigo-100"
                  onClick={() => setProfileOpen(!isProfileOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white font-medium text-sm">
                    {user?.fullNameEnglish?.charAt(0) || user?.fullNameBangla?.charAt(0) || 'U'}
                  </div>
                  <span className="text-gray-700">{user?.fullNameBangla || user?.fullNameEnglish || 'User'}</span>
                </Button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 top-12 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.fullNameEnglish}</p>
                      <p className="text-xs text-gray-500">{user?.contact}</p>
                    </div>
                    
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                      onClick={() => setProfileOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      ড্যাশবোর্ড
                    </Link>
                    
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      প্রোফাইল
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <LogOut className="w-4 h-4" />
                      লগআউট
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth">
                <Button className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md transition-all">
                  লগইন / রেজিস্টার
                </Button>
              </Link>
            )}
          </div>
          
          <div className="md:hidden flex items-center gap-3">
            {isAuthenticated && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white font-medium text-sm mr-2">
                {user?.fullNameEnglish?.charAt(0) || user?.fullNameBangla?.charAt(0) || 'U'}
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(true)}
              aria-label="Open mobile menu"
              className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-100"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
        
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
            className={`w-80 bg-white h-full p-6 flex flex-col gap-6 shadow-lg rounded-r-xl transform transition-transform duration-300
              ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
            ref={menuRef}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex justify-between items-center mb-4">
              <Link
                href="/"
                className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                onClick={() => setMenuOpen(false)}
              >
                কুইজ প্রতিযোগিতা
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="hover:text-red-500 transition p-1 rounded-lg hover:bg-red-50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {isAuthenticated && (
              <div className="px-4 py-3 bg-indigo-50 rounded-lg mb-4">
                <p className="font-medium text-gray-900">{user?.fullNameEnglish}</p>
                <p className="text-sm text-gray-600">{user?.contact}</p>
              </div>
            )}
            
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 font-medium transition p-3 rounded-lg hover:bg-indigo-50"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            
            <div className="mt-auto pt-4 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 font-medium transition p-3 rounded-lg hover:bg-indigo-50"
                    onClick={() => setMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    ড্যাশবোর্ড
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full text-red-600 hover:text-red-700 font-medium transition p-3 rounded-lg hover:bg-red-50"
                  >
                    <LogOut className="w-5 h-5" />
                    লগআউট
                  </button>
                </div>
              ) : (
                <Link href="/auth" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md">
                    লগইন / রেজিস্টার
                  </Button>
                </Link>
              )}
            </div>
          </aside>
        </div>
      </header>
      
      <div className="h-16"></div>
    </>
  );
}