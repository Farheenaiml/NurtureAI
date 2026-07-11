import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HeartPulse, CalendarClock, Ruler, Weight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { CircularProgress } from "@/components/shared/CircularProgress";
import { useAuthStore } from "@/store/authStore";
import { weeklyInfo, babySizeByWeek } from "@/services/mockData";

export const Route = createFileRoute("/app/pregnancy")({
  head: () => ({ meta: [{ title: "Pregnancy Journey — Nurture" }] }),
  component: PregnancyPage,
});

function PregnancyPage() {
  const week = useAuthStore((s) => s.user?.currentWeek ?? 26);
  const [selected, setSelected] = useState<number | null>(null);
  const size = babySizeByWeek[week] ?? { fruit: "Cucumber", emoji: "🥒", weight: "760g", length: "35cm" };
  const progress = Math.round((week / 40) * 100);
  const info = weeklyInfo.find((w) => w.week === (selected ?? week));

  return (
    <div className="space-y-6">
      <PageHeader icon={HeartPulse} title="Pregnancy Journey" subtitle={`Week ${week} · ${week <= 13 ? "First" : week <= 27 ? "Second" : "Third"} Trimester`} />

      <Card className="rounded-3xl border-primary/20 bg-gradient-soft p-6">
        <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr]">
          <CircularProgress value={progress} size={190}>
            <div><p className="font-display text-5xl font-extrabold">{week}</p><p className="text-xs text-muted-foreground">of 40 weeks</p></div>
          </CircularProgress>
          <div>
            <p className="text-sm text-muted-foreground">Baby is the size of a</p>
            <p className="font-display text-3xl font-bold">{size.emoji} {size.fruit}</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <Stat icon={Weight} label="Weight" value={size.weight} />
              <Stat icon={Ruler} label="Length" value={size.length} />
              <Stat icon={CalendarClock} label="Days left" value={String((40 - week) * 7)} />
            </div>
          </div>
        </div>
      </Card>

      <Card className="rounded-3xl border-border/60 p-6">
        <h3 className="mb-4 font-display font-bold">Weekly Timeline</h3>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
          {[1, 5, 10, 15, 20, 25, week, 40].filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a - b).map((w) => (
            <button key={w} onClick={() => setSelected(w)} className={`rounded-2xl border p-3 text-center transition card-hover ${w === week ? "border-primary bg-gradient-primary text-primary-foreground shadow-glow" : "border-border/60 hover:border-primary/40"}`}>
              <p className="text-[10px] opacity-70">Week</p>
              <p className="font-display text-lg font-bold">{w}</p>
            </button>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">Tap any week for detailed guidance</p>
      </Card>

      <Dialog open={selected !== null} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto rounded-3xl sm:max-w-lg">
          {info && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-2xl">{info.size.emoji}</span>
                <div><h3 className="font-display text-xl font-bold">Week {info.week}</h3><p className="text-sm text-muted-foreground">{info.trimester === 1 ? "First" : info.trimester === 2 ? "Second" : "Third"} Trimester · {info.size.fruit}</p></div>
              </div>
              <Detail label="Baby Development" text={info.babyDevelopment} />
              <Detail label="Mother's Body Changes" text={info.motherChanges} />
              <DetailList label="Common Symptoms" items={info.symptoms} />
              <DetailList label="Nutrition Tips" items={info.nutrition} />
              <Detail label="Medical Advice" text={info.medical} />
              <DetailList label="Things to Avoid" items={info.avoid} tone="warning" />
              <Detail label="Doctor Visit" text={info.doctorVisit} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
function Stat({ icon: Icon, label, value }: { icon: typeof Weight; label: string; value: string }) {
  return <div className="rounded-xl bg-card/70 p-3 text-center"><Icon className="mx-auto h-4 w-4 text-primary" /><p className="mt-1 font-display text-sm font-bold">{value}</p><p className="text-[10px] text-muted-foreground">{label}</p></div>;
}
function Detail({ label, text }: { label: string; text: string }) {
  return <div className="rounded-xl bg-muted/40 p-3"><p className="text-xs font-semibold uppercase tracking-wide text-primary">{label}</p><p className="mt-1 text-sm text-muted-foreground">{text}</p></div>;
}
function DetailList({ label, items, tone }: { label: string; items: string[]; tone?: "warning" }) {
  return (
    <div className={`rounded-xl p-3 ${tone === "warning" ? "bg-warning/5" : "bg-muted/40"}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide ${tone === "warning" ? "text-warning" : "text-primary"}`}>{label}</p>
      <ul className="mt-1.5 flex flex-wrap gap-1.5">{items.map((i) => <li key={i} className="rounded-full bg-card px-2.5 py-1 text-xs">{i}</li>)}</ul>
    </div>
  );
}
