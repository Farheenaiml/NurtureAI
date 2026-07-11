import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Bot, Baby, Apple, Activity, Stethoscope, HeartPulse,
  CalendarDays, FileText, User, Settings, Siren, Milk, BookHeart,
  Sparkles, Droplets, Footprints, Bell, X,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavItem {
  label: string;
  to: string;
  icon: typeof Bot;
}

const commonTop: NavItem[] = [
  { label: "Dashboard", to: "/app", icon: LayoutDashboard },
  { label: "AI Assistant", to: "/app/ai-assistant", icon: Bot },
];

const pregnancyNav: NavItem[] = [
  { label: "Pregnancy Journey", to: "/app/pregnancy", icon: HeartPulse },
  { label: "Baby Development", to: "/app/baby-development", icon: Baby },
  { label: "Nutrition", to: "/app/nutrition", icon: Apple },
  { label: "Exercise", to: "/app/exercise", icon: Footprints },
  { label: "Symptom Checker", to: "/app/symptoms", icon: Stethoscope },
  { label: "Kick Tracker", to: "/app/kick-tracker", icon: Activity },
  { label: "Mental Wellness", to: "/app/wellness", icon: BookHeart },
];

const postpartumNav: NavItem[] = [
  { label: "Recovery", to: "/app/postpartum", icon: HeartPulse },
  { label: "Baby Care", to: "/app/baby-care", icon: Baby },
  { label: "Breastfeeding", to: "/app/breastfeeding", icon: Milk },
  { label: "Mood & Wellness", to: "/app/wellness", icon: BookHeart },
  { label: "Journal", to: "/app/journal", icon: BookHeart },
  { label: "Nutrition", to: "/app/nutrition", icon: Apple },
];

const commonBottom: NavItem[] = [
  { label: "Appointments", to: "/app/appointments", icon: CalendarDays },
  { label: "Reports", to: "/app/reports", icon: FileText },
  { label: "Notifications", to: "/app/notifications", icon: Bell },
  { label: "Profile", to: "/app/profile", icon: User },
  { label: "Settings", to: "/app/settings", icon: Settings },
];

function NavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = item.to === "/app" ? pathname === "/app" : pathname.startsWith(item.to);
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
        active
          ? "bg-gradient-primary text-primary-foreground shadow-glow"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

export function Sidebar({ onNavigate, showClose }: { onNavigate?: () => void; showClose?: boolean }) {
  const stage = useAuthStore((s) => s.user?.stage ?? "pregnant");
  const journeyNav = stage === "postpartum" ? postpartumNav : pregnancyNav;

  return (
    <aside className="flex h-full w-[264px] flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center justify-between px-5 py-5">
        <Logo />
        {showClose && (
          <button onClick={onNavigate} className="rounded-lg p-1.5 text-muted-foreground hover:bg-sidebar-accent">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-1 pb-4">
          {commonTop.map((i) => <NavLink key={i.to} item={i} onNavigate={onNavigate} />)}
          <p className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {stage === "postpartum" ? "Recovery" : "Pregnancy"}
          </p>
          {journeyNav.map((i) => <NavLink key={i.to + i.label} item={i} onNavigate={onNavigate} />)}
          <p className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            General
          </p>
          {commonBottom.map((i) => <NavLink key={i.to} item={i} onNavigate={onNavigate} />)}
        </nav>
      </ScrollArea>
      <div className="p-3">
        <Link
          to="/app/emergency"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl bg-destructive/10 px-3 py-3 text-sm font-semibold text-destructive transition hover:bg-destructive/15"
        >
          <Siren className="h-[18px] w-[18px]" />
          Emergency SOS
        </Link>
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-accent px-3 py-2.5 text-xs text-primary">
          <Sparkles className="h-4 w-4 shrink-0" />
          <span>Nurture Premium active</span>
        </div>
      </div>
    </aside>
  );
}

export { Droplets };
