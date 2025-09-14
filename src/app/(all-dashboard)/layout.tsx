"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, initializeAuth } from "@/redux/features/auth/authSlice";
import {
  LayoutDashboard,
  User,
  BookOpen,
  Trophy,
  LogOut,
  Menu,
  X,
  BarChart3,
  Users,
  FileText,
  Home,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AppDispatch, RootState } from "@/store/store";
import Link from "next/link"; // Import Link from next/link

const sidebarItems = {
  student: [
    { label: "ড্যাশবোর্ড", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "কুইজ", href: "/student/quiz", icon: BookOpen },
    { label: "ফলাফল", href: "/student/results", icon: Trophy },
    { label: "প্রোফাইল", href: "/student/profile", icon: User },
  ],
  admin: [
    { label: "ড্যাশবোর্ড", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "ব্যবহারকারী", href: "/admin/users", icon: Users },
    { label: "কুইজ পরিচালনা", href: "/admin/quizzes", icon: BookOpen },
    { label: "পরিসংখ্যান", href: "/admin/analytics", icon: BarChart3 },
    { label: "রিপোর্ট", href: "/admin/reports", icon: FileText },
  ],
};
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  const { user, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );
  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  // Initialize auth on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          await dispatch(initializeAuth()).unwrap();
        }
      } catch (error) {
        console.log("Auth initialization failed");
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, [dispatch]);
  // Handle authentication and authorization
  useEffect(() => {
    if (isCheckingAuth) return;
    if (!isAuthenticated || !user) {
      router.replace("/auth");
      return;
    }
    const isAdminPath = pathname.startsWith("/admin");
    const isStudentPath = pathname.startsWith("/student");
    if (isAdminPath && user.role !== "admin") {
      toast.error("Admin access required");
      router.replace("/student/dashboard");
    } else if (isStudentPath && user.role !== "student") {
      toast.error("Student access required");
      router.replace("/admin/dashboard");
    }
  }, [pathname, user, isAuthenticated, isCheckingAuth, router]);
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("লগআউট সফল হয়েছে");
      router.push("/");
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : "লগআউট করতে সমস্যা হয়েছে"
      );
    }
  };
  // Show loading while checking authentication
  if (isCheckingAuth || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <p className="mt-2 text-gray-600">লোড হচ্ছে...</p>
      </div>
    );
  }
  if (!isAuthenticated || !user) {
    return null;
  }
  const userRole = user.role?.toLowerCase() || 'student';
  const items = sidebarItems[userRole as keyof typeof sidebarItems] || [];
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
      {/* Sidebar - Different animation for mobile vs desktop */}
      {isMobile ? (
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-600 to-indigo-700 text-white"
            >
              <SidebarContent 
                user={user} 
                items={items} 
                pathname={pathname}
                onClose={() => setSidebarOpen(false)}
                onLogout={handleLogout}
              />
            </motion.aside>
          )}
        </AnimatePresence>
      ) : (
        <aside className="hidden lg:flex lg:flex-shrink-0">
          <div className="w-64 bg-gradient-to-b from-blue-600 to-indigo-700 text-white">
            <SidebarContent 
              user={user} 
              items={items} 
              pathname={pathname}
              onLogout={handleLogout}
            />
          </div>
        </aside>
      )}
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {items.find((item) => item.href === pathname)?.label ||
                  "ড্যাশবোর্ড"}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Use Link with Button for client-side navigation */}
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <Link href="/" className="flex items-center space-x-2">
                  <Home className="w-4 h-4" />
                  <span>হোমপেজ</span>
                </Link>
              </Button>
            </div>
          </div>
        </header>
        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
// Separate sidebar content component
function SidebarContent({ user, items, pathname, onClose, onLogout }: {
  user: any;
  items: any[];
  pathname: string;
  onClose?: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-500">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-xl font-bold">কুইজ প্রতিযোগিতা</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg hover:bg-blue-500"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      {/* User info */}
      <div className="p-4 border-b border-blue-500">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 font-semibold">
            {user.fullNameEnglish?.charAt(0) ||
              user.fullNameBangla?.charAt(0) ||
              "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user.fullNameEnglish || user.fullNameBangla}
            </p>
            <p className="text-xs text-blue-200 truncate">
              {user.role === "admin" ? "এডমিন" : "শিক্ষার্থী"}
            </p>
          </div>
        </div>
      </div>
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            // Use Link component instead of anchor tag
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                isActive
                  ? "bg-white text-blue-600 shadow-lg"
                  : "text-blue-100 hover:bg-blue-500 hover:text-white"
              }`}
              onClick={() => onClose?.()} // Close sidebar on mobile after navigation
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      {/* Logout */}
      <div className="p-4 border-t border-blue-500">
        <button
          onClick={onLogout}
          className="flex items-center space-x-3 w-full px-3 py-2 text-blue-100 hover:bg-blue-500 hover:text-white rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">লগআউট</span>
        </button>
      </div>
    </div>
  );
}