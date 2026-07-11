import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookHeart, Plus, Mic } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { toast } from "sonner";

export const Route = createFileRoute("/app/journal")({
  head: () => ({ meta: [{ title: "Journal — Nurture" }] }),
  component: JournalPage,
});
const emotions = ["😊", "😌", "😔", "😢", "😣", "🥰"];

function JournalPage() {
  const [text, setText] = useState("");
  const [emotion, setEmotion] = useState("😊");
  const [entries, setEntries] = useState([
    { id: "j1", date: "Jul 10", emotion: "🥰", text: "Baby smiled at me for the first time today. My heart is so full." },
    { id: "j2", date: "Jul 8", emotion: "😌", text: "Slept a little better last night. Feeling more like myself." },
  ]);
  const save = () => {
    if (!text.trim()) return;
    setEntries([{ id: crypto.randomUUID(), date: "Today", emotion, text }, ...entries]);
    setText(""); toast.success("Journal entry saved 📖");
  };
  return (
    <div className="space-y-6">
      <PageHeader icon={BookHeart} title="Journal" subtitle="Your private space to reflect" />
      <Card className="rounded-3xl border-border/60 p-6">
        <div className="mb-3 flex gap-2">{emotions.map((e) => <button key={e} onClick={() => setEmotion(e)} className={`grid h-10 w-10 place-items-center rounded-xl text-xl transition ${emotion === e ? "bg-accent ring-2 ring-primary" : "bg-muted"}`}>{e}</button>)}</div>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="How are you feeling today?" className="min-h-32 rounded-2xl" />
        <div className="mt-3 flex gap-2">
          <Button className="rounded-xl bg-gradient-primary" onClick={save}><Plus className="mr-1 h-4 w-4" /> Save Entry</Button>
          <Button variant="outline" className="rounded-xl" onClick={() => toast.success("Voice journal coming soon 🎙️")}><Mic className="mr-1 h-4 w-4" /> Voice Journal</Button>
        </div>
      </Card>
      {entries.length ? (
        <div className="space-y-3">
          {entries.map((e) => (
            <Card key={e.id} className="rounded-2xl border-border/60 p-5"><div className="flex items-center gap-2"><span className="text-xl">{e.emotion}</span><span className="text-xs font-semibold text-muted-foreground">{e.date}</span></div><p className="mt-2 text-sm">{e.text}</p></Card>
          ))}
        </div>
      ) : <EmptyState icon={BookHeart} title="No entries yet" description="Start writing to capture your journey." />}
    </div>
  );
}
