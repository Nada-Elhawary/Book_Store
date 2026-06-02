"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

export function PublicHeader() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border/40 backdrop-blur-sm fixed top-0 w-full z-50 bg-background/80">
      <Link className="flex items-center justify-center" href="/">
        <BookOpen className="h-6 w-6 text-primary" />
        <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-amber-600">
          NexusBooks
        </span>
      </Link>

      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
        <ThemeToggle />
        <Link className="text-sm font-medium hover:text-primary transition-colors" href="/books">
          Catalog
        </Link>

        {mounted && isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="relative h-10 flex items-center gap-2 rounded-full pl-2 pr-4 hover:bg-muted/50 border border-transparent hover:border-border bg-transparent outline-none cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <User className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/dashboard")} className="cursor-pointer">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => { logout(); router.push("/"); }}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : !mounted ? (
          <div className="w-24 h-8" /> 
        ) : (
          <div className="flex items-center gap-4">
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/login">
              Login
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-primary/90 hover:bg-primary rounded-full px-5">
                Get Started
              </Button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

