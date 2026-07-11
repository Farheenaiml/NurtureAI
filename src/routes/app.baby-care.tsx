import { createFileRoute } from "@tanstack/react-router";
import { Baby, Ruler, Weight, Circle, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { babyGrowth, babyMilestones, sleepLog } from "@/services/mockData";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/app/baby-care")({
  head: () => ({ meta: [{ title: "Baby Care — Nurture" }] }),
  component: BabyCarePage,
});

function BabyCarePage() {
  return (
    <div className="space-y-6">
      <PageHeader icon={Baby} title="Baby Care" subtitle="Track your little one's growth" />
      <div className="grid gap-4 sm:grid-cols-4">
        {[{ i: Baby, l: "Age", v: babyGrowth.age }, { i: Weight, l: "Weight", v: babyGrowth.weight }, { i: Ruler, l: "Height", v: babyGrowth.height }, { i: Circle, l: "Head", v: babyGrowth.head }].map((s) => (
          <Card key={s.l} className="rounded-2xl border-border/60 p-5 card-hover"><span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-primary"><s.i className="h-5 w-5" /></span><p className="mt-2 text-sm text-muted-foreground">{s.l}</p><p className="font-display text-xl font-bold">{s.v}</p></Card>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="rounded-3xl border-border/60 p-6">
          <h3 className="mb-3 font-display font-bold">Sleep This Week</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={sleepLog}>
              <defs><linearGradient id="bs" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} /><stop offset="100%" stopColor="var(--primary)" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", fontSize: 12 }} />
              <Area type="monotone" dataKey="hours" stroke="var(--primary)" strokeWidth={2.5} fill="url(#bs)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="rounded-3xl border-border/60 p-6">
          <h3 className="mb-3 font-display font-bold">Development Milestones</h3>
          <div className="space-y-2">
            {babyMilestones.map((m) => (
              <div key={m.title} className="flex items-center gap-3 rounded-xl border border-border/60 px-3 py-2.5">
                <span className={`grid h-6 w-6 place-items-center rounded-full ${m.done ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}>{m.done ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-3 w-3" />}</span>
                <span className={`text-sm ${m.done ? "" : "text-muted-foreground"}`}>{m.title}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
