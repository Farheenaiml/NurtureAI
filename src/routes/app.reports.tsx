import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download, Share2, TrendingUp, Moon, SmilePlus, Apple } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { aiInsights } from "@/services/mockData";
import { toast } from "sonner";

export const Route = createFileRoute("/app/reports")({
  head: () => ({ meta: [{ title: "Reports — Nurture" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  const sections = [
    { icon: TrendingUp, t: "Mother's Health Summary", d: "Weight stable, vitals normal" },
    { icon: Apple, t: "Nutrition Summary", d: "82% average score this week" },
    { icon: SmilePlus, t: "Mood Report", d: "Improving trend" },
    { icon: Moon, t: "Sleep Report", d: "5.4h average" },
  ];
  return (
    <div className="space-y-6">
      <PageHeader icon={FileText} title="Reports" subtitle="Your health, beautifully summarized" action={
        <div className="flex gap-2"><Button variant="outline" className="rounded-xl" onClick={() => toast.success("Preparing PDF…")}><Download className="mr-1 h-4 w-4" /> Export</Button><Button className="rounded-xl bg-gradient-primary" onClick={() => toast.success("Share link copied")}><Share2 className="mr-1 h-4 w-4" /> Share</Button></div>
      } />
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <Card key={s.t} className="rounded-2xl border-border/60 p-5 card-hover"><span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary"><s.icon className="h-5 w-5" /></span><p className="mt-3 font-display font-bold">{s.t}</p><p className="text-sm text-muted-foreground">{s.d}</p></Card>
        ))}
      </div>
      <Card className="rounded-3xl border-border/60 p-6">
        <h3 className="mb-3 font-display font-bold">Weekly AI Insights</h3>
        <div className="space-y-2">{aiInsights.map((i, idx) => <div key={idx} className="rounded-xl bg-muted/50 p-3 text-sm">✨ {i}</div>)}</div>
      </Card>
    </div>
  );
}
