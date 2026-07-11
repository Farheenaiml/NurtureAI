import { createFileRoute } from "@tanstack/react-router";
import { Settings2, Moon, Sun, Bell, Globe, Shield, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { useUIStore } from "@/store/uiStore";
import { languages } from "@/services/mockData";
import { toast } from "sonner";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings — Nurture" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, setTheme } = useUIStore();
  return (
    <div className="space-y-6">
      <PageHeader icon={Settings2} title="Settings" subtitle="Customize your experience" />
      <Card className="rounded-3xl border-border/60 p-6">
        <div className="mb-4 flex items-center gap-2"><Moon className="h-5 w-5 text-primary" /><h3 className="font-display font-bold">Appearance</h3></div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setTheme("light")} className={`flex items-center gap-3 rounded-2xl border p-4 ${theme === "light" ? "border-primary bg-accent" : "border-border/60"}`}><Sun className="h-5 w-5" /> Light Mode</button>
          <button onClick={() => setTheme("dark")} className={`flex items-center gap-3 rounded-2xl border p-4 ${theme === "dark" ? "border-primary bg-accent" : "border-border/60"}`}><Moon className="h-5 w-5" /> Dark Mode</button>
        </div>
      </Card>
      <Card className="rounded-3xl border-border/60 p-6">
        <div className="mb-4 flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /><h3 className="font-display font-bold">Notifications</h3></div>
        {["Medicine Reminder", "Water Reminder", "Exercise Reminder", "Doctor Appointment", "Mood Reminder", "Push Notifications", "Email Notifications"].map((n, i) => (
          <div key={n} className="flex items-center justify-between border-b border-border/50 py-3 last:border-0"><span className="text-sm">{n}</span><Switch defaultChecked={i < 5} /></div>
        ))}
      </Card>
      <Card className="rounded-3xl border-border/60 p-6">
        <div className="mb-4 flex items-center gap-2"><Globe className="h-5 w-5 text-primary" /><h3 className="font-display font-bold">Language & Region</h3></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Select defaultValue="English"><SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger><SelectContent>{languages.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select>
          <Select defaultValue="Metric"><SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Metric">Metric (kg, cm)</SelectItem><SelectItem value="Imperial">Imperial (lb, in)</SelectItem></SelectContent></Select>
        </div>
        <p className="mt-3 rounded-xl bg-accent p-3 text-xs text-primary">✨ AI-powered translation for all 9 languages coming soon.</p>
      </Card>
      <Card className="rounded-3xl border-border/60 p-6">
        <div className="mb-4 flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /><h3 className="font-display font-bold">Privacy & Security</h3></div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-xl" onClick={() => toast.success("Password change flow")}><Lock className="mr-1 h-4 w-4" /> Change Password</Button>
          <Button variant="outline" className="rounded-xl" onClick={() => toast.success("Preparing your data…")}>Download My Data</Button>
          <Button variant="outline" className="rounded-xl text-destructive" onClick={() => toast.error("Account deletion requires confirmation")}>Delete Account</Button>
        </div>
      </Card>
    </div>
  );
}
