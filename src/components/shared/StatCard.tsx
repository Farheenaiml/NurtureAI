import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  tone?: "primary" | "success" | "warning" | "destructive";
  className?: string;
}

const toneMap = {
  primary: "bg-accent text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
  destructive: "bg-destructive/10 text-destructive",
};

export function StatCard({ icon: Icon, label, value, sub, tone = "primary", className }: StatCardProps) {
  return (
    <Card className={cn("card-hover flex items-center gap-4 rounded-2xl border-border/60 p-5", className)}>
      <span className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-xl", toneMap[tone])}>
        <Icon className="h-6 w-6" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm text-muted-foreground">{label}</p>
        <p className="font-display text-2xl font-bold leading-tight">{value}</p>
        {sub && <p className="truncate text-xs text-muted-foreground">{sub}</p>}
      </div>
    </Card>
  );
}
