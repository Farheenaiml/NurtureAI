import { createFileRoute } from "@tanstack/react-router";
import { Baby, Brain, Heart, Activity, Ear, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAuthStore } from "@/store/authStore";
import { weeklyInfo, babySizeByWeek } from "@/services/mockData";

export const Route = createFileRoute("/app/baby-development")({
  head: () => ({ meta: [{ title: "Baby Development — Nurture" }] }),
  component: BabyDev,
});

function BabyDev() {
  const week = useAuthStore((s) => s.user?.currentWeek ?? 26);
  const size = babySizeByWeek[week] ?? { fruit: "Cucumber", emoji: "🥒", weight: "760g", length: "35cm" };
  const organs = [
    { icon: Brain, label: "Brain", pct: "Rapid development" },
    { icon: Heart, label: "Heart", pct: "Fully formed" },
    { icon: Activity, label: "Movement", pct: "Active kicks" },
    { icon: Ear, label: "Hearing", pct: "Responds to sound" },
    { icon: Eye, label: "Vision", pct: "Eyes opening" },
  ];
  return (
    <div className="space-y-6">
      <PageHeader icon={Baby} title="Baby Development" subtitle={`Week ${week} milestones`} />
      <Card className="rounded-3xl border-primary/20 bg-gradient-soft p-8 text-center">
        <span className="text-6xl">{size.emoji}</span>
        <p className="mt-2 font-display text-2xl font-bold">Size of a {size.fruit}</p>
        <div className="mx-auto mt-4 grid max-w-md grid-cols-3 gap-3">
          <div className="rounded-xl bg-card/70 p-3"><p className="font-display font-bold">{size.weight}</p><p className="text-[10px] text-muted-foreground">Weight</p></div>
          <div className="rounded-xl bg-card/70 p-3"><p className="font-display font-bold">{size.length}</p><p className="text-[10px] text-muted-foreground">Length</p></div>
          <div className="rounded-xl bg-card/70 p-3"><p className="font-display font-bold">Week {week}</p><p className="text-[10px] text-muted-foreground">Current</p></div>
        </div>
      </Card>
      <Card className="rounded-3xl border-border/60 p-6">
        <h3 className="mb-4 font-display font-bold">Organ Development</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {organs.map((o) => (
            <div key={o.label} className="rounded-2xl border border-border/60 p-4 text-center card-hover">
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary"><o.icon className="h-5 w-5" /></span>
              <p className="mt-2 text-sm font-semibold">{o.label}</p>
              <p className="text-xs text-muted-foreground">{o.pct}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card className="rounded-3xl border-border/60 p-6">
        <h3 className="mb-4 font-display font-bold">Weekly Development Timeline</h3>
        <div className="space-y-3">
          {weeklyInfo.filter((w) => w.week >= week - 2 && w.week <= week + 3).map((w) => (
            <div key={w.week} className={`flex gap-4 rounded-2xl border p-4 ${w.week === week ? "border-primary bg-accent" : "border-border/60"}`}>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-primary text-primary-foreground font-display font-bold">{w.week}</span>
              <div><p className="text-sm font-semibold">Week {w.week}</p><p className="text-sm text-muted-foreground">{w.babyDevelopment}</p></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
