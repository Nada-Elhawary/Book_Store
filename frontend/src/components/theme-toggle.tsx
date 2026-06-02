"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-10 h-10 border-transparent hover:border-border hover:bg-muted/50"
    >
      {theme === "light" ? (
        <Moon className="h-[1.2rem] w-[1.2rem] text-foreground/70" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] text-amber-400" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
