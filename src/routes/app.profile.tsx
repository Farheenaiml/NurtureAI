import { createFileRoute } from "@tanstack/react-router";
import { User, Pencil, Baby } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

export const Route = createFileRoute("/app/profile")({
  head: () => ({ meta: [{ title: "Profile — Nurture" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;
  const journey = user.stage === "pregnant" ? `Pregnant · Week ${user.currentWeek}` : `Postpartum · Baby ${user.babyAgeWeeks} weeks`;
  return (
    <div className="space-y-6">
      <PageHeader icon={User} title="Profile" subtitle="Manage your information" />
      <Card className="rounded-3xl border-primary/20 bg-gradient-soft p-6">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4">
          <Avatar className="h-20 w-20 border-2 border-card"><AvatarFallback className="bg-gradient-primary text-2xl text-primary-foreground">{user.fullName.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
          <div className="min-w-0"><h2 className="truncate font-display text-2xl font-bold">{user.fullName}</h2><p className="text-sm text-primary">{journey}</p><p className="text-xs text-muted-foreground">Profile 90% complete</p></div>
          <Button variant="outline" className="rounded-xl" onClick={() => toast.success("Edit profile")}><Pencil className="mr-1 h-4 w-4" /> Edit</Button>
        </div>
      </Card>
      <Section title="Personal Information" rows={[["Name", user.fullName], ["Email", user.email], ["Phone", user.phone ?? "—"], ["Age", String(user.age ?? "—")], ["Country", user.country ?? "—"], ["Language", user.language ?? "—"], ["Blood Group", user.bloodGroup ?? "—"], ["Emergency Contact", user.emergencyContact ?? "—"]]} />
      <Section title="Medical Profile" rows={[["Doctor", user.doctor ?? "—"], ["Hospital", user.hospital ?? "—"], ["Conditions", user.conditions ?? "—"], ["Allergies", user.allergies ?? "—"], ["Medications", user.medications ?? "—"], ["Height", user.height ? `${user.height} cm` : "—"], ["Weight", user.weight ? `${user.weight} kg` : "—"]]} />
      {user.stage === "postpartum" && (
        <Card className="rounded-3xl border-border/60 p-6">
          <div className="mb-3 flex items-center gap-2"><Baby className="h-5 w-5 text-primary" /><h3 className="font-display font-bold">Baby Information</h3></div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[["Baby Name", user.babyName ?? "—"], ["Age", `${user.babyAgeWeeks} weeks`], ["Delivery Type", user.deliveryType ?? "—"], ["Breastfeeding", user.breastfeeding ? "Yes" : "No"]].map(([k, v]) => (
              <div key={k} className="flex justify-between rounded-xl bg-muted/40 px-3 py-2 text-sm"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
function Section({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <Card className="rounded-3xl border-border/60 p-6">
      <h3 className="mb-3 font-display font-bold">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map(([k, v]) => <div key={k} className="flex justify-between rounded-xl bg-muted/40 px-3 py-2 text-sm"><span className="text-muted-foreground">{k}</span><span className="truncate pl-2 font-medium">{v}</span></div>)}
      </div>
    </Card>
  );
}
