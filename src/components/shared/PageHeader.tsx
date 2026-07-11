import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4", className)}>
      <div className="flex min-w-0 items-center gap-3">
        {Icon && (
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent text-primary">
            <Icon className="h-6 w-6" />
          </span>
        )}
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-bold sm:text-3xl">{title}</h1>
          {subtitle && <p className="truncate text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
