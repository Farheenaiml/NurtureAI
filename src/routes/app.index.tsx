import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Baby, Droplets, Pill, CalendarDays, Bot, Stethoscope, SmilePlus, Apple, Siren,
  HeartPulse, Moon, Milk, TrendingUp, Sparkles, ArrowRight, Plus, Check,
} from "lucide-react";
import { useState } from "react";
import {
  LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CircularProgress } from "@/components/shared/CircularProgress";
import { useAuthStore } from "@/store/authStore";
import {
  babySizeByWeek, medicines, moodTrend, weightTrend, waterWeekTrend, sleepLog,
  healthTips, aiInsights, feedingLog,
} from "@/services/mockData";
import { toast } from "sonner";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: "Dashboard — Nurture" }] }),
  component: Dashboard,
});

function Dashboard() {
  const stage = useAuthStore((s) => s.user?.stage ?? "pregnant");
  return stage === "postpartum" ? <PostpartumDashboard /> : <PregnancyDashboard />;
}

const chartTip = {
  contentStyle: { borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", fontSize: 12 },
};

/* ----------------- PREGNANCY ----------------- */
function PregnancyDashboard() {
  const user = useAuthStore((s) => s.user);
  const week = user?.currentWeek ?? 26;
  const size = babySizeByWeek[week] ?? { fruit: "Cucumber", emoji: "🥒", weight: "760g", length: "35cm" };
  const progress = Math.round((week / 40) * 100);
  const daysLeft = (40 - week) * 7;
  const trimester = week <= 13 ? "First" : week <= 27 ? "Second" : "Third";
  const [water, setWater] = useState(1500);

  return (
    <div className="space-y-6">
      <QuickActions stage="pregnant" />

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Pregnancy progress hero */}
        <Card className="relative overflow-hidden rounded-3xl border-primary/20 bg-gradient-soft p-6 lg:col-span-2">
          <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr]">
            <CircularProgress value={progress} size={168}>
              <div>
                <p className="text-xs text-muted-foreground">Week</p>
                <p className="font-display text-4xl font-extrabold">{week}</p>
                <p className="text-xs font-medium text-primary">{trimester} Trimester</p>
              </div>
            </CircularProgress>
            <div>
              <p className="text-sm text-muted-foreground">Your baby is the size of a</p>
              <p className="font-display text-2xl font-bold">{size.emoji} {size.fruit}</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <MiniStat label="Weight" value={size.weight} />
                <MiniStat label="Length" value={size.length} />
                <MiniStat label="Days left" value={String(daysLeft)} />
              </div>
              <Button asChild variant="link" className="mt-3 h-auto p-0 text-primary">
                <Link to="/app/pregnancy">View pregnancy journey <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </Card>

        {/* Water intake */}
        <Card className="rounded-3xl border-border/60 p-6">
          <div className="mb-2 flex items-center gap-2"><Droplets className="h-5 w-5 text-primary" /><h3 className="font-display font-bold">Water Intake</h3></div>
          <div className="flex items-center justify-center py-2">
            <CircularProgress value={(water / 2500) * 100} size={130}>
              <div><p className="font-display text-xl font-bold">{(water / 1000).toFixed(1)}L</p><p className="text-[10px] text-muted-foreground">of 2.5L</p></div>
            </CircularProgress>
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {[250, 500].map((v) => (
              <Button key={v} variant="outline" size="sm" className="col-span-2 rounded-xl" onClick={() => { setWater((w) => Math.min(2500, w + v)); toast.success(`+${v}ml logged 💧`); }}>
                <Plus className="mr-1 h-3 w-3" /> {v}ml
              </Button>
            ))}
          </div>
        </Card>
      </div>

      {/* Row: tips, nutrition, mood */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="rounded-3xl border-border/60 p-6">
          <div className="mb-3 flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /><h3 className="font-display font-bold">Today's Health Tips</h3></div>
          <div className="space-y-3">
            {healthTips.map((t) => (
              <div key={t.title} className="flex gap-3 rounded-xl bg-muted/50 p-3">
                <span className="text-xl">{t.emoji}</span>
                <div><p className="text-sm font-semibold">{t.title}</p><p className="text-xs text-muted-foreground">{t.text}</p></div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-3xl border-border/60 p-6">
          <div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-2"><Apple className="h-5 w-5 text-primary" /><h3 className="font-display font-bold">Today's Nutrition</h3></div><span className="text-sm font-bold text-success">82%</span></div>
          <div className="space-y-3">
            {[["Protein", 76], ["Iron", 78], ["Calcium", 82], ["Folic Acid", 87]].map(([n, v]) => (
              <div key={n as string}>
                <div className="mb-1 flex justify-between text-xs"><span>{n}</span><span className="text-muted-foreground">{v}%</span></div>
                <Progress value={v as number} className="h-1.5" />
              </div>
            ))}
          </div>
          <Button asChild variant="link" className="mt-2 h-auto p-0 text-primary"><Link to="/app/nutrition">Open planner <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
        </Card>

        <Card className="rounded-3xl border-border/60 p-6">
          <div className="mb-3 flex items-center gap-2"><SmilePlus className="h-5 w-5 text-primary" /><h3 className="font-display font-bold">Mood Trend</h3></div>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={moodTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...chartTip} />
              <Line type="monotone" dataKey="mood" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="energy" stroke="var(--secondary)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Medication + appointments + charts */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="rounded-3xl border-border/60 p-6">
          <div className="mb-3 flex items-center gap-2"><Pill className="h-5 w-5 text-primary" /><h3 className="font-display font-bold">Medication Reminder</h3></div>
          <div className="space-y-2">
            {medicines.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2.5">
                <div><p className="text-sm font-semibold">{m.name}</p><p className="text-xs text-muted-foreground">{m.dosage} · {m.time}</p></div>
                <StatusPill status={m.status} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-3xl border-border/60 p-6">
          <div className="mb-3 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /><h3 className="font-display font-bold">Weight Progress</h3></div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={weightTrend}>
              <defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} /><stop offset="100%" stopColor="var(--primary)" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={["dataMin - 2", "dataMax + 2"]} hide />
              <Tooltip {...chartTip} />
              <Area type="monotone" dataKey="weight" stroke="var(--primary)" strokeWidth={2.5} fill="url(#wg)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <div className="space-y-5">
          <Card className="rounded-3xl border-border/60 p-6">
            <div className="mb-3 flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary" /><h3 className="font-display font-bold">Next Appointment</h3></div>
            <p className="text-sm font-semibold">Prenatal Check-up</p>
            <p className="text-xs text-muted-foreground">Dr. Emily Carter · Jul 18, 10:30 AM</p>
            <Button asChild size="sm" variant="outline" className="mt-3 w-full rounded-xl"><Link to="/app/appointments">View all</Link></Button>
          </Card>
          <EmergencyCard />
        </div>
      </div>

      <AIConversationsCard />
      <WaterChart data={waterWeekTrend} sleep={sleepLog} feeding={feedingLog} />
    </div>
  );
}

/* ----------------- POSTPARTUM ----------------- */
function PostpartumDashboard() {
  const user = useAuthStore((s) => s.user);
  const babyWeeks = user?.babyAgeWeeks ?? 6;
  const daysSince = babyWeeks * 7;
  const recovery = Math.min(100, Math.round((babyWeeks / 12) * 100));

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border-primary/20 bg-gradient-soft p-6">
        <p className="max-w-2xl text-sm text-muted-foreground">
          You're doing an amazing job. Recovery takes time, and we're here to support you every step of the way. 💙
        </p>
      </Card>

      <QuickActions stage="postpartum" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={HeartPulse} label="Days Since Delivery" value={String(daysSince)} sub={`${babyWeeks} weeks`} />
        <MetricCard icon={TrendingUp} label="Recovery Progress" value={`${recovery}%`} sub="On track" tone="success" />
        <MetricCard icon={Moon} label="Sleep Quality" value="5.4h" sub="Last night" tone="warning" />
        <MetricCard icon={SmilePlus} label="Mood Score" value="Good" sub="Improving" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="rounded-3xl border-border/60 p-6 lg:col-span-2">
          <div className="mb-3 flex items-center gap-2"><Moon className="h-5 w-5 text-primary" /><h3 className="font-display font-bold">Sleep This Week</h3></div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={sleepLog}>
              <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} /><stop offset="100%" stopColor="var(--primary)" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...chartTip} />
              <Area type="monotone" dataKey="hours" stroke="var(--primary)" strokeWidth={2.5} fill="url(#sg)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="rounded-3xl border-border/60 p-6">
          <div className="mb-3 flex items-center gap-2"><Milk className="h-5 w-5 text-primary" /><h3 className="font-display font-bold">Baby Feeding</h3></div>
          <div className="space-y-2">
            {feedingLog.slice(0, 4).map((f) => (
              <div key={f.id} className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2">
                <div><p className="text-sm font-semibold">{f.side} · {f.type}</p><p className="text-xs text-muted-foreground">{f.time}</p></div>
                <span className="text-xs text-muted-foreground">{f.duration}</span>
              </div>
            ))}
          </div>
          <Button asChild size="sm" variant="outline" className="mt-3 w-full rounded-xl"><Link to="/app/breastfeeding">Track feeding</Link></Button>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="rounded-3xl border-border/60 p-6 lg:col-span-2">
          <div className="mb-3 flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /><h3 className="font-display font-bold">AI Insights</h3></div>
          <div className="space-y-2">
            {aiInsights.map((i, idx) => (
              <div key={idx} className="flex items-start gap-3 rounded-xl bg-muted/50 p-3 text-sm"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {i}</div>
            ))}
          </div>
        </Card>
        <div className="space-y-5">
          <Card className="rounded-3xl border-border/60 p-6">
            <h3 className="mb-3 font-display font-bold">Daily Recovery Goals</h3>
            {["Rest 30 min", "Drink water", "Pelvic exercises", "Journal"].map((g, i) => (
              <label key={g} className="flex items-center gap-3 py-1.5 text-sm"><input type="checkbox" defaultChecked={i < 2} className="h-4 w-4 accent-[var(--primary)]" /> {g}</label>
            ))}
          </Card>
          <EmergencyCard />
        </div>
      </div>
      <AIConversationsCard />
    </div>
  );
}

/* ----------------- Shared bits ----------------- */
function QuickActions({ stage }: { stage: "pregnant" | "postpartum" }) {
  const actions = stage === "pregnant"
    ? [
        { icon: Bot, label: "Talk to AI", to: "/app/ai-assistant" },
        { icon: Stethoscope, label: "Track Symptoms", to: "/app/symptoms" },
        { icon: SmilePlus, label: "Log Mood", to: "/app/wellness" },
        { icon: Apple, label: "Check Nutrition", to: "/app/nutrition" },
        { icon: Siren, label: "Emergency SOS", to: "/app/emergency" },
      ]
    : [
        { icon: Bot, label: "Talk to AI", to: "/app/ai-assistant" },
        { icon: SmilePlus, label: "Log Mood", to: "/app/wellness" },
        { icon: Milk, label: "Track Feeding", to: "/app/breastfeeding" },
        { icon: Moon, label: "Track Sleep", to: "/app/baby-care" },
        { icon: Siren, label: "Emergency", to: "/app/emergency" },
      ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {actions.map((a) => (
        <Link key={a.label} to={a.to} className="card-hover flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-card p-4 text-center">
          <span className={`grid h-11 w-11 place-items-center rounded-xl ${a.label.includes("Emergency") ? "bg-destructive/10 text-destructive" : "bg-accent text-primary"}`}><a.icon className="h-5 w-5" /></span>
          <span className="text-xs font-semibold">{a.label}</span>
        </Link>
      ))}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-card/70 p-2 text-center"><p className="font-display text-sm font-bold">{value}</p><p className="text-[10px] text-muted-foreground">{label}</p></div>;
}
function MetricCard({ icon: Icon, label, value, sub, tone = "primary" }: { icon: typeof Baby; label: string; value: string; sub: string; tone?: "primary" | "success" | "warning" }) {
  const t = { primary: "bg-accent text-primary", success: "bg-success/10 text-success", warning: "bg-warning/15 text-warning" }[tone];
  return (
    <Card className="card-hover rounded-2xl border-border/60 p-5">
      <span className={`grid h-11 w-11 place-items-center rounded-xl ${t}`}><Icon className="h-5 w-5" /></span>
      <p className="mt-3 text-sm text-muted-foreground">{label}</p>
      <p className="font-display text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </Card>
  );
}
function StatusPill({ status }: { status: "taken" | "skipped" | "upcoming" }) {
  const map = { taken: "bg-success/10 text-success", skipped: "bg-destructive/10 text-destructive", upcoming: "bg-muted text-muted-foreground" };
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${map[status]}`}>{status}</span>;
}
function EmergencyCard() {
  return (
    <Card className="rounded-3xl border-destructive/30 bg-destructive/5 p-6">
      <div className="flex items-center gap-2 text-destructive"><Siren className="h-5 w-5" /><h3 className="font-display font-bold">Emergency</h3></div>
      <p className="mt-1 text-xs text-muted-foreground">Quick access to help when you need it most.</p>
      <Button asChild variant="destructive" size="sm" className="mt-3 w-full rounded-xl"><Link to="/app/emergency">Open SOS</Link></Button>
    </Card>
  );
}
function AIConversationsCard() {
  return (
    <Card className="rounded-3xl border-border/60 p-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2"><Bot className="h-5 w-5 text-primary" /><h3 className="font-display font-bold">Recent AI Conversations</h3></div>
        <Button asChild variant="link" className="h-auto p-0 text-primary"><Link to="/app/ai-assistant">Open <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {["Nutrition for week 26", "Is mild swelling normal?", "Sleeping positions"].map((c) => (
          <Link key={c} to="/app/ai-assistant" className="rounded-xl border border-border/60 p-3 text-sm transition hover:bg-accent">💬 {c}</Link>
        ))}
      </div>
    </Card>
  );
}
function WaterChart({ data, sleep, feeding }: { data: typeof waterWeekTrend; sleep: typeof sleepLog; feeding: typeof feedingLog }) {
  return (
    <Card className="rounded-3xl border-border/60 p-6">
      <div className="mb-3 flex items-center gap-2"><Droplets className="h-5 w-5 text-primary" /><h3 className="font-display font-bold">Water Intake — This Week</h3></div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data}>
          <defs><linearGradient id="wk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--secondary)" stopOpacity={0.35} /><stop offset="100%" stopColor="var(--secondary)" stopOpacity={0} /></linearGradient></defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip {...chartTip} />
          <Area type="monotone" dataKey="ml" stroke="var(--secondary)" strokeWidth={2.5} fill="url(#wk)" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
