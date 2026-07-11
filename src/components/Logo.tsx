import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, textClassName }: { className?: string; textClassName?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2.5", className)}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-glow">
        <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
      </span>
      <span className={cn("font-display text-xl font-extrabold tracking-tight text-foreground", textClassName)}>
        Nurture
      </span>
    </Link>
  );
}
