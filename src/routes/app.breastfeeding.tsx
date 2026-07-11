import { createFileRoute } from "@tanstack/react-router";
import { Milk } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { feedingLog } from "@/services/mockData";
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, CartesianGrid } from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/app/breastfeeding")({
  head: () => ({ meta: [{ title: "Breastfeeding — Nurture" }] }),
  component: BF,
});
const week = [{ day: "Mon", feeds: 8 }, { day: "Tue", feeds: 9 }, { day: "Wed", feeds: 7 }, { day: "Thu", feeds: 10 }, { day: "Fri", feeds: 8 }, { day: "Sat", feeds: 9 }, { day: "Sun", feeds: 8 }];

function BF() {
  return (
    <div className="space-y-6">
      <PageHeader icon={Milk} title="Breastfeeding Tracker" subtitle="Log every feed with ease" />
      <div className="grid gap-3 sm:grid-cols-4">
        {["Left", "Right", "Bottle", "Formula"].map((s) => (
          <Button key={s} variant="outline" className="h-16 rounded-2xl text-base" onClick={() => toast.success(`${s} feed logged 🍼`)}>{s}</Button>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="rounded-3xl border-border/60 p-6">
          <h3 className="mb-3 font-display font-bold">Today's Feeds</h3>
          <div className="space-y-2">
            {feedingLog.map((f) => (
              <div key={f.id} className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2.5"><div><p className="text-sm font-semibold">{f.side} · {f.type}</p><p className="text-xs text-muted-foreground">{f.time}</p></div><span className="text-xs text-muted-foreground">{f.duration}</span></div>
            ))}
          </div>
        </Card>
        <Card className="rounded-3xl border-border/60 p-6">
          <h3 className="mb-3 font-display font-bold">Weekly Feeds</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={week}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", fontSize: 12 }} />
              <Bar dataKey="feeds" fill="var(--primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
