import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookHeart, Wind, Sparkles, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/shared/PageHeader";
import { affirmations } from "@/services/mockData";
import { toast } from "sonner";

export const Route = createFileRoute("/app/wellness")({
  head: () => ({ meta: [{ title: "Mental Wellness — Nurture" }] }),
  component: WellnessPage,
});

const moods = [
  { e: "😊", l: "Happy" }, { e: "🙂", l: "Calm" }, { e: "😐", l: "Neutral" },
  { e: "😔", l: "Sad" }, { e: "😢", l: "Overwhelmed" }, { e: "😣", l: "Anxious" },
];

function WellnessPage() {
  const [mood, setMood] = useState("Calm");
  const [stress, setStress] = useState([3]);
  const [energy, setEnergy] = useState([4]);
  return (
    <div className="space-y-6">
      <PageHeader icon={BookHeart} title="Mental Wellness" subtitle="Nurture your emotional health" />
      <Card className="rounded-3xl border-primary/20 bg-gradient-soft p-6">
        <div className="flex items-center gap-2 text-primary"><Sparkles className="h-5 w-5" /><p className="text-sm font-semibold uppercase tracking-wide">Daily Affirmation</p></div>
        <p className="mt-2 font-display text-xl font-bold">"{affirmations[new Date().getDay() % affirmations.length]}"</p>
      </Card>
      <Card className="rounded-3xl border-border/60 p-6">
        <h3 className="mb-3 font-display font-bold">How are you feeling today?</h3>
        <div className="flex flex-wrap gap-2">
          {moods.map((m) => (
            <button key={m.l} onClick={() => setMood(m.l)} className={`flex flex-col items-center gap-1 rounded-2xl border px-4 py-3 transition ${mood === m.l ? "border-primary bg-accent" : "border-border/60 hover:border-primary/40"}`}>
              <span className="text-2xl">{m.e}</span><span className="text-xs font-medium">{m.l}</span>
            </button>
          ))}
        </div>
        <div className="mt-5 space-y-4">
          <div><div className="mb-1 flex justify-between text-sm"><span>Stress Level</span><span className="text-muted-foreground">{stress[0]}/5</span></div><Slider value={stress} onValueChange={setStress} min={1} max={5} step={1} /></div>
          <div><div className="mb-1 flex justify-between text-sm"><span>Energy Level</span><span className="text-muted-foreground">{energy[0]}/5</span></div><Slider value={energy} onValueChange={setEnergy} min={1} max={5} step={1} /></div>
        </div>
        <Textarea placeholder="Write a short journal entry…" className="mt-4 rounded-2xl" />
        <Button className="mt-4 rounded-xl bg-gradient-primary" onClick={() => toast.success("Mood saved 💙")}><Save className="mr-1 h-4 w-4" /> Save Mood</Button>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { icon: Wind, t: "Breathing Exercise", d: "4-7-8 calming technique" },
          { icon: Sparkles, t: "Mindfulness", d: "5-minute grounding session" },
          { icon: BookHeart, t: "Gratitude Journal", d: "Note 3 things you're grateful for" },
        ].map((c) => (
          <Card key={c.t} className="rounded-3xl border-border/60 p-6 card-hover">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary"><c.icon className="h-5 w-5" /></span>
            <p className="mt-3 font-display font-bold">{c.t}</p><p className="text-sm text-muted-foreground">{c.d}</p>
            <Button variant="outline" size="sm" className="mt-3 rounded-xl" onClick={() => toast.success(`Starting ${c.t}`)}>Begin</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
