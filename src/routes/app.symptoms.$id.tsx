import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, AlertTriangle, Phone, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { symptoms } from "@/services/mockData";

export const Route = createFileRoute("/app/symptoms/$id")({
  head: () => ({ meta: [{ title: "Symptom — Nurture" }] }),
  component: SymptomDetail,
});

const sev = {
  green: { c: "text-success bg-success/10", l: "Low — usually normal" },
  yellow: { c: "text-warning bg-warning/15", l: "Mild — monitor" },
  orange: { c: "text-[oklch(0.6_0.17_50)] bg-[oklch(0.7_0.17_50)]/10", l: "Moderate — contact doctor" },
  red: { c: "text-destructive bg-destructive/10", l: "Urgent — seek care" },
};

function SymptomDetail() {
  const { id } = useParams({ from: "/app/symptoms/$id" });
  const s = symptoms.find((x) => x.id === id);
  if (!s) return <div className="p-8 text-center text-muted-foreground">Symptom not found. <Link to="/app/symptoms" className="text-primary">Back</Link></div>;
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Button asChild variant="ghost" size="sm" className="rounded-xl"><Link to="/app/symptoms"><ArrowLeft className="mr-1 h-4 w-4" /> All symptoms</Link></Button>
      <Card className="rounded-3xl border-border/60 p-6">
        <div className="flex items-center gap-4">
          <span className="text-4xl">{s.emoji}</span>
          <div><h1 className="font-display text-2xl font-bold">{s.name}</h1><span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${sev[s.severity].c}`}>{sev[s.severity].l}</span></div>
        </div>
        <p className="mt-4 text-muted-foreground">{s.overview}</p>
      </Card>
      {s.emergency && (
        <Card className="rounded-3xl border-destructive/40 bg-destructive/5 p-6">
          <div className="flex items-center gap-2 text-destructive"><AlertTriangle className="h-6 w-6" /><h3 className="font-display text-lg font-bold">Seek medical attention</h3></div>
          <p className="mt-1 text-sm text-muted-foreground">{s.whenToCall}</p>
          <div className="mt-3 flex flex-wrap gap-2"><Button variant="destructive" className="rounded-xl"><Phone className="mr-1 h-4 w-4" /> Emergency Call</Button><Button variant="outline" className="rounded-xl"><MapPin className="mr-1 h-4 w-4" /> Find Hospital</Button></div>
        </Card>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <Block title="Possible Causes" items={s.causes} />
        <Block title="Recommendations" items={s.recommendations} />
        <Block title="Self Care Tips" items={s.selfCare} />
        <Card className="rounded-3xl border-border/60 p-6"><h3 className="mb-2 font-display font-bold">When to Contact Doctor</h3><p className="text-sm text-muted-foreground">{s.whenToCall}</p></Card>
      </div>
      <p className="rounded-2xl bg-muted/50 p-4 text-xs text-muted-foreground">⚕️ Medical Disclaimer: This information is for guidance only and does not replace professional medical advice.</p>
    </div>
  );
}
function Block({ title, items }: { title: string; items: string[] }) {
  return <Card className="rounded-3xl border-border/60 p-6"><h3 className="mb-2 font-display font-bold">{title}</h3><ul className="space-y-1.5 text-sm text-muted-foreground">{items.map((i) => <li key={i}>• {i}</li>)}</ul></Card>;
}
