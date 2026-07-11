import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HeartPulse } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { recoveryTimeline } from "@/services/mockData";

export const Route = createFileRoute("/app/postpartum")({
  head: () => ({ meta: [{ title: "Recovery — Nurture" }] }),
  component: PostpartumPage,
});

function PostpartumPage() {
  const [open, setOpen] = useState<number | null>(null);
  const item = open !== null ? recoveryTimeline[open] : null;
  return (
    <div className="space-y-6">
      <PageHeader icon={HeartPulse} title="Recovery Timeline" subtitle="Healing takes time — we're with you" />
      <div className="relative pl-6">
        <span className="absolute left-2 top-2 h-[calc(100%-1rem)] w-px bg-border" />
        <div className="space-y-4">
          {recoveryTimeline.map((r, i) => (
            <button key={r.period} onClick={() => setOpen(i)} className="relative block w-full text-left">
              <span className="absolute -left-[18px] top-5 h-3 w-3 rounded-full bg-gradient-primary ring-4 ring-background" />
              <Card className="rounded-2xl border-border/60 p-4 card-hover">
                <p className="text-xs font-semibold text-primary">{r.period}</p>
                <p className="font-display font-bold">{r.title}</p>
                <p className="text-sm text-muted-foreground">{r.body}</p>
              </Card>
            </button>
          ))}
        </div>
      </div>
      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto rounded-3xl sm:max-w-lg">
          {item && (
            <div className="space-y-3">
              <h3 className="font-display text-xl font-bold">{item.period} · {item.title}</h3>
              <Row label="Body Recovery" text={item.details.body} />
              <Row label="Hormonal Changes" text={item.details.hormonal} />
              <Row label="Emotional Changes" text={item.details.emotional} />
              <Row label="Nutrition" text={item.details.nutrition} />
              <Row label="Exercise" text={item.details.exercise} />
              <Row label="Doctor" text={item.details.doctor} />
              <div className="rounded-xl bg-warning/5 p-3"><p className="text-xs font-semibold uppercase text-warning">Things to Avoid</p><p className="mt-1 text-sm text-muted-foreground">{item.details.avoid.join(", ")}</p></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
function Row({ label, text }: { label: string; text: string }) {
  return <div className="rounded-xl bg-muted/40 p-3"><p className="text-xs font-semibold uppercase tracking-wide text-primary">{label}</p><p className="mt-1 text-sm text-muted-foreground">{text}</p></div>;
}
