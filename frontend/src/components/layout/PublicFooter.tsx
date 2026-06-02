import Link from "next/link";
import { BookOpen } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="w-full py-6 bg-background border-t border-border/40">
      <div className="container px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center mx-auto max-w-7xl">
        <div className="flex items-center gap-2 mb-4 sm:mb-0">
          <p className="text-sm text-muted-foreground">© 2026 NexusBooks. All rights reserved.</p>
        </div>
        <div className="flex gap-4">
          <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="#">
            Terms
          </Link>
          <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="#">
            Privacy
          </Link>
          <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/">
            Home
          </Link>
        </div>
      </div>
    </footer>
  );
}
