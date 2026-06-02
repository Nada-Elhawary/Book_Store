"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Menu } from "lucide-react";
import { api } from "@/lib/axios";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, setAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const { data } = await api.get("/api/users/me");
        setAuth(data);
      } catch (err) {
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, [router, setAuth]);

  if (isChecking || !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* ── Mobile top bar with burger button ── */}
        <header className="md:hidden flex h-14 items-center gap-3 px-4 border-b border-border bg-card flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-muted transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-foreground" />
          </button>
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-amber-600">
            NexusBooks
          </span>
        </header>

        <main className="flex-1 overflow-y-auto bg-muted/20">
          <div className="container mx-auto p-4 md:p-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
