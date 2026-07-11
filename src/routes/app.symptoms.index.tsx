import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Stethoscope, Search, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/PageHeader";
import { symptoms } from "@/services/mockData";

export const Route = createFileRoute("/app/symptoms/")({
  head: () => ({ meta: [{ title: "Symptom Checker — Nurture" }] }),
  component: SymptomsPage,
});

const sevColor = { green: "bg-success", yellow: "bg-warning", orange: "bg-[oklch(0.7_0.17_50)]", red: "bg-destructive" };

function SymptomsPage() {
  const [q, setQ] = useState("");
  const filtered = symptoms.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-6">
      <PageHeader icon={Stethoscope} title="Symptom Checker" subtitle="Understand your symptoms with trusted guidance" />
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search symptoms…" className="h-14 rounded-2xl pl-12 text-base" />
      </div>
      <div>
        <p className="mb-3 text-sm font-semibold text-muted-foreground">Popular Symptoms</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <Link key={s.id} to="/app/symptoms/$id" params={{ id: s.id }} className="card-hover flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4">
              <span className="text-2xl">{s.emoji}</span>
              <div className="min-w-0 flex-1"><p className="font-semibold">{s.name}</p><p className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className={`h-2 w-2 rounded-full ${sevColor[s.severity]}`} /> {s.severity === "red" ? "Seek care" : s.severity === "green" ? "Usually normal" : "Monitor"}</p></div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
