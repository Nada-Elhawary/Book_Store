"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen, LogOut, User as UserIcon,
  LayoutDashboard, Library, House, X,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const getNavItems = (role?: string) => {
  const items = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Catalog",   href: "/books",     icon: Library },
    { name: "My Rentals",href: "/dashboard/rentals", icon: BookOpen },
    { name: "Home",      href: "/",          icon: House },
  ];

  if (role === "admin") {
    items.push(
      { name: "Manage Books", href: "/dashboard/admin/books", icon: Library },
      { name: "All Orders", href: "/dashboard/admin/orders", icon: BookOpen }
    );
  }

  return items;
};

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const sidebarContent = (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border shadow-sm">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-border">
        <div className="flex items-center">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-amber-600">
            NexusBooks
          </span>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {/* Close button — visible only on mobile */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-md hover:bg-muted transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Nav links */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-4">
          {getNavItems(user?.role).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User info + logout */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <UserIcon className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium truncate w-32">{user?.name}</span>
            <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
          </div>
        </div>
        <Button variant="outline" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar (always visible ≥ md) ── */}
      <aside className="hidden md:flex h-screen flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* ── Mobile overlay + drawer ── */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Drawer panel slides in from left */}
          <aside className="relative z-10 h-full animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
