

"use client";

import { Button } from "@/components/ui/button";
import { ChartCandlestick, Home, Menu, Settings, Users, X } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  collapsed: boolean;
  toggleCollapse: () => void;
}

const Sidebar: FC<SidebarProps> = ({
  isOpen,
  toggleSidebar,
  collapsed,
  toggleCollapse,
}) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen bg-gray-800 text-white 
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-14" : "w-64"}
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex items-center justify-between p-3 border-b border-white/20">
          {!collapsed && <h2 className="text-lg font-bold">Admin Panel</h2>}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              className="text-white hover:bg-white/10"
            >
              <Menu />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-white lg:hidden hover:bg-white/10"
            >
              <X />
            </Button>
          </div>
        </div>

        <nav className="mt-4 space-y-1">
          {[
            { href: "/dashboard", icon: <Home />, label: "Dashboard" },
            {
              href: "/analytics",
              icon: <ChartCandlestick />,
              label: "Analytics",
            },
            { href: "/users", icon: <Users />, label: "Users" },
            { href: "/settings", icon: <Settings />, label: "Settings" },
          ].map(({ href, icon, label }) => (
            <Link href={href} key={href}>
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-white/10"
              >
                <span className="mr-2">{icon}</span>
                {!collapsed && label}
              </Button>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
