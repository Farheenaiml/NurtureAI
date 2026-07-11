import { useNavigate } from "@tanstack/react-router";
import { Bell, Menu, Moon, Search, Sun, LogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 18) return "Good Afternoon";
  return "Good Evening";
}

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { theme, toggleTheme } = useUIStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const firstName = user?.fullName?.split(" ")[0] ?? "there";

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/70 bg-background/80 px-4 py-3 backdrop-blur-xl sm:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenu}>
        <Menu className="h-5 w-5" />
      </Button>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-base font-bold sm:text-lg">
          {greeting()}, {firstName} <span className="align-middle">🌸</span>
        </p>
        <p className="hidden text-xs text-muted-foreground sm:block">
          {user?.stage === "postpartum"
            ? "You're doing an amazing job — recovery takes time."
            : "Here's your health overview for today."}
        </p>
      </div>

      <div className="relative hidden md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search Nurture…" className="h-10 w-56 rounded-xl pl-9" />
      </div>

      <Button variant="ghost" size="icon" className="rounded-xl" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>

      <Button
        variant="ghost" size="icon"
        className="relative rounded-xl"
        onClick={() => navigate({ to: "/app/notifications" })}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-full outline-none ring-primary/40 focus-visible:ring-2">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarFallback className="bg-gradient-primary text-sm font-semibold text-primary-foreground">
                {firstName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 rounded-xl">
          <DropdownMenuLabel className="truncate">{user?.fullName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate({ to: "/app/profile" })}>
            <User className="mr-2 h-4 w-4" /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate({ to: "/app/settings" })}>
            <Settings className="mr-2 h-4 w-4" /> Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => {
              logout();
              toast.success("Signed out");
              navigate({ to: "/" });
            }}
          >
            <LogOut className="mr-2 h-4 w-4" /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
