import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Activity, Play, Square } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, CartesianGrid } from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/app/kick-tracker")({
  head: () => ({ meta: [{ title: "Kick Tracker — Nurture" }] }),
  component: KickTracker,
});

const history = [
  { day: "Mon", kicks: 12 }, { day: "Tue", kicks: 15 }, { day: "Wed", kicks: 10 },
  { day: "Thu", kicks: 18 }, { day: "Fri", kicks: 14 }, { day: "Sat", kicks: 16 }, { day: "Sun", kicks: 13 },
];

function KickTracker() {
  const [active, setActive] = useState(false);
  const [kicks, setKicks] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);
  const toggle = () => {
    if (active) { if (timer.current) clearInterval(timer.current); setActive(false); toast.success(`Session saved · ${kicks} kicks`); }
    else { setActive(true); setKicks(0); setSeconds(0); timer.current = setInterval(() => setSeconds((s) => s + 1), 1000); }
  };
  return (
    <div className="space-y-6">
      <PageHeader icon={Activity} title="Baby Kick Tracker" subtitle="Count your baby's movements" />
      <Card className="rounded-3xl border-primary/20 bg-gradient-soft p-8 text-center">
        <button onClick={() => active && setKicks((k) => k + 1)} disabled={!active} className={`mx-auto grid h-40 w-40 place-items-center rounded-full text-primary-foreground transition ${active ? "bg-gradient-primary shadow-glow active:scale-95" : "bg-muted text-muted-foreground"}`}>
          <div><p className="font-display text-5xl font-extrabold">{kicks}</p><p className="text-xs">kicks</p></div>
        </button>
        <p className="mt-4 text-sm text-muted-foreground">{active ? `Tap the circle each kick · ${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}` : "Start a session to begin counting"}</p>
        <Button className="mt-4 rounded-xl bg-gradient-primary" onClick={toggle}>{active ? <><Square className="mr-1 h-4 w-4" /> Stop Session</> : <><Play className="mr-1 h-4 w-4" /> Start Session</>}</Button>
      </Card>
      <Card className="rounded-3xl border-border/60 p-6">
        <h3 className="mb-3 font-display font-bold">Weekly Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", fontSize: 12 }} />
            <Bar dataKey="kicks" fill="var(--primary)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
