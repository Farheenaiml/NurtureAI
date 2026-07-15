import { createFileRoute, Outlet, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuthStore } from "@/store/authStore";
import { getCurrentUserServerFn } from "../backend/authServer";

export const Route = createFileRoute("/app")({
  loader: async () => {
    try {
      const user = await getCurrentUserServerFn();
      if (!user) {
        throw redirect({ to: "/login" });
      }
      if (!user.onboarded) {
        throw redirect({ to: "/onboarding" });
      }
      return { user };
    } catch (e) {
      if (e && typeof e === "object" && "status" in e) {
        throw e;
      }
      throw redirect({ to: "/login" });
    }
  },
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  const { isAuthenticated, onboarded } = useAuthStore();
  const [drawer, setDrawer] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    } else if (!onboarded) {
      navigate({ to: "/onboarding" });
    } else {
      setReady(true);
    }
  }, [isAuthenticated, onboarded, navigate]);

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm">Loading your care space…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="hidden lg:block">
        <div className="sticky top-0 h-screen"><Sidebar /></div>
      </div>
      <Sheet open={drawer} onOpenChange={setDrawer}>
        <SheetContent side="left" className="w-[264px] p-0">
          <Sidebar onNavigate={() => setDrawer(false)} showClose />
        </SheetContent>
      </Sheet>
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setDrawer(true)} />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
