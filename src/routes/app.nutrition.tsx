import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Apple, Droplets, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { CircularProgress } from "@/components/shared/CircularProgress";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip, CartesianGrid } from "recharts";
import { todaysMeals, nutrients, foodsToEat, foodsToAvoid, waterWeekTrend } from "@/services/mockData";
import { toast } from "sonner";

export const Route = createFileRoute("/app/nutrition")({
  head: () => ({ meta: [{ title: "Nutrition — Nurture" }] }),
  component: NutritionPage,
});

function NutritionPage() {
  const [water, setWater] = useState(1500);
  return (
    <div className="space-y-6">
      <PageHeader icon={Apple} title="Nutrition" subtitle="Fuel your body and your baby's growth" />
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="rounded-3xl border-primary/20 bg-gradient-soft p-6 text-center lg:col-span-1">
          <h3 className="mb-3 font-display font-bold">Today's Nutrition Score</h3>
          <CircularProgress value={82} size={170}><div><p className="font-display text-4xl font-extrabold">82</p><p className="text-xs text-muted-foreground">Great!</p></div></CircularProgress>
        </Card>
        <Card className="rounded-3xl border-border/60 p-6 lg:col-span-2">
          <h3 className="mb-4 font-display font-bold">Nutrient Goals</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {nutrients.map((n) => (
              <div key={n.name} className="text-center">
                <CircularProgress value={(n.value / n.target) * 100} size={96} strokeWidth={8}><p className="font-display text-sm font-bold">{Math.round((n.value / n.target) * 100)}%</p></CircularProgress>
                <p className="mt-1 text-xs font-semibold">{n.name}</p>
                <p className="text-[10px] text-muted-foreground">{n.value}/{n.target}{n.unit}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="rounded-3xl border-border/60 p-6">
        <h3 className="mb-4 font-display font-bold">Today's Meal Planner</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {todaysMeals.map((m) => (
            <div key={m.name} className="rounded-2xl border border-border/60 p-4">
              <p className="text-2xl">{m.emoji}</p>
              <p className="mt-1 font-semibold">{m.name}</p>
              <p className="text-xs text-muted-foreground">{m.calories} kcal</p>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">{m.items.map((i) => <li key={i}>• {i}</li>)}</ul>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="rounded-3xl border-border/60 p-6">
          <div className="mb-3 flex items-center gap-2"><Droplets className="h-5 w-5 text-primary" /><h3 className="font-display font-bold">Water Intake</h3></div>
          <div className="grid place-items-center py-2">
            <CircularProgress value={(water / 2500) * 100} size={150}><div><p className="font-display text-2xl font-bold">{(water / 1000).toFixed(1)}L</p><p className="text-[10px] text-muted-foreground">of 2.5L</p></div></CircularProgress>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[250, 500, 750, 1000].map((v) => <Button key={v} size="sm" variant="outline" className="rounded-xl px-1 text-[11px]" onClick={() => { setWater((w) => Math.min(2500, w + v)); toast.success(`+${v}ml 💧`); }}><Plus className="h-3 w-3" />{v}</Button>)}
          </div>
        </Card>
        <Card className="rounded-3xl border-border/60 p-6 lg:col-span-2">
          <h3 className="mb-3 font-display font-bold">Weekly Water Trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={waterWeekTrend}>
              <defs><linearGradient id="nw" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} /><stop offset="100%" stopColor="var(--primary)" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", fontSize: 12 }} />
              <Area type="monotone" dataKey="ml" stroke="var(--primary)" strokeWidth={2.5} fill="url(#nw)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="rounded-3xl border-border/60 p-6">
          <h3 className="mb-3 font-display font-bold text-success">Foods to Eat</h3>
          <div className="grid grid-cols-2 gap-3">{foodsToEat.map((f) => <div key={f.name} className="rounded-xl bg-success/5 p-3"><p className="text-xl">{f.emoji}</p><p className="text-sm font-semibold">{f.name}</p><p className="text-xs text-muted-foreground">{f.benefit}</p></div>)}</div>
        </Card>
        <Card className="rounded-3xl border-border/60 p-6">
          <h3 className="mb-3 font-display font-bold text-destructive">Foods to Avoid</h3>
          <div className="grid grid-cols-2 gap-3">{foodsToAvoid.map((f) => <div key={f.name} className="rounded-xl bg-destructive/5 p-3"><p className="text-xl">{f.emoji}</p><p className="text-sm font-semibold">{f.name}</p><p className="text-xs text-muted-foreground">{f.reason}</p></div>)}</div>
        </Card>
      </div>
    </div>
  );
}
