import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, MapPin, Plus, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { appointments } from "@/services/mockData";
import { toast } from "sonner";

export const Route = createFileRoute("/app/appointments")({
  head: () => ({ meta: [{ title: "Appointments — Nurture" }] }),
  component: AppointmentsPage,
});

function AppointmentsPage() {
  const upcoming = appointments.filter((a) => a.status === "upcoming");
  const past = appointments.filter((a) => a.status === "completed");
  return (
    <div className="space-y-6">
      <PageHeader icon={CalendarDays} title="Doctor Appointments" subtitle="Manage your visits" action={<Button className="rounded-xl bg-gradient-primary" onClick={() => toast.success("Add appointment form")}><Plus className="mr-1 h-4 w-4" /> Add</Button>} />
      <div><h3 className="mb-3 font-display font-bold">Upcoming</h3><div className="space-y-3">{upcoming.map((a) => <AptCard key={a.id} a={a} />)}</div></div>
      <div><h3 className="mb-3 font-display font-bold">Previous</h3><div className="space-y-3">{past.map((a) => <AptCard key={a.id} a={a} />)}</div></div>
    </div>
  );
}
function AptCard({ a }: { a: typeof appointments[number] }) {
  return (
    <Card className="rounded-2xl border-border/60 p-5 card-hover">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <p className="font-display font-bold">{a.title}</p>
          <p className="text-sm text-muted-foreground">{a.doctor} · {a.reason}</p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{a.date} · {a.time}</span>
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{a.hospital}</span>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${a.status === "upcoming" ? "bg-accent text-primary" : "bg-muted text-muted-foreground"}`}>{a.status}</span>
      </div>
    </Card>
  );
}
