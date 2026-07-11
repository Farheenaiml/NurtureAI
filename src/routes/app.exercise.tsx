import { createFileRoute } from "@tanstack/react-router";
import { Footprints, Clock, Gauge } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { exercises } from "@/services/mockData";
import { toast } from "sonner";

export const Route = createFileRoute("/app/exercise")({
  head: () => ({ meta: [{ title: "Exercise — Nurture" }] }),
  component: ExercisePage,
});

function ExercisePage() {
  return (
    <div className="space-y-6">
      <PageHeader icon={Footprints} title="Exercise" subtitle="Safe, gentle movement for every trimester" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {exercises.map((e) => (
          <Card key={e.id} className="rounded-3xl border-border/60 p-5 card-hover">
            <span className="text-3xl">{e.emoji}</span>
            <p className="mt-2 font-display font-bold">{e.name}</p>
            <p className="text-xs text-primary">{e.category}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-1"><Clock className="h-3 w-3" />{e.duration}</span>
              <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-1"><Gauge className="h-3 w-3" />{e.difficulty}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{e.trimester}</p>
            <ul className="mt-2 flex flex-wrap gap-1">{e.benefits.map((b) => <li key={b} className="rounded-full bg-accent px-2 py-0.5 text-[11px] text-primary">{b}</li>)}</ul>
            <Button size="sm" className="mt-4 w-full rounded-xl bg-gradient-primary" onClick={() => toast.success(`Starting ${e.name} 🧘‍♀️`)}>Start Workout</Button>
          </Card>
        ))}
      </div>
      <Card className="rounded-3xl border-border/60 p-6">
        <h3 className="mb-3 font-display font-bold">This Week</h3>
        <div className="grid grid-cols-7 gap-2 text-center">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
            <div key={d} className={`rounded-xl border p-3 ${i < 4 ? "border-primary bg-accent text-primary" : "border-border/60 text-muted-foreground"}`}><p className="text-xs">{d}</p><p className="mt-1 text-lg">{i < 4 ? "✓" : "—"}</p></div>
          ))}
        </div>
      </Card>
    </div>
  );
}
