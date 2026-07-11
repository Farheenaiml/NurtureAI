import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  Bot, Send, Mic, Upload, Plus, Search, Pin, Trash2, MoreVertical, Copy, ThumbsUp, ThumbsDown,
  RefreshCw, Share2, Bookmark, Languages, Sparkles, ShieldCheck, Volume2, AlertTriangle,
  Phone, MapPin, Stethoscope, ChevronDown, PanelLeft, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { conversations as seedConversations, suggestedQuestions } from "@/services/mockData";
import { generateAIResponse, type AIResponse } from "@/services/index";
import { VoiceMode } from "@/components/ai/VoiceMode";
import { toast } from "sonner";

export const Route = createFileRoute("/app/ai-assistant")({
  head: () => ({ meta: [{ title: "Nurture AI — Your Care Companion" }] }),
  component: AIAssistant;
});

interface Msg { id: string; role: "user" | "assistant"; text?: string; ai?: AIResponse; time: string; streaming?: boolean }

const smartActions = [
  { icon: Stethoscope, label: "Analyze Symptoms" },
  { icon: Sparkles, label: "Nutrition Advice" },
  { icon: Bot, label: "Baby Development" },
  { icon: Sparkles, label: "Mental Wellness" },
  { icon: ShieldCheck, label: "Medicine Info" },
  { icon: AlertTriangle, label: "Emergency Help" },
];

function AIAssistant() {
  const [convos, setConvos] = useState(seedConversations);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, thinking]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", text, time: now }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      const ai = generateAIResponse(text);
      setThinking(false);
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", ai, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), streaming: true }]);
      setTimeout(() => setMessages((m) => m.map((x) => ({ ...x, streaming: false }))), 1400);
    }, 1400);
  };

  const newChat = () => { setMessages([]); toast.success("Started a new chat"); inputRef.current?.focus(); };

  return (
    <div className="grid h-[calc(100vh-8rem)] grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
      {/* LEFT PANEL (desktop) */}
      <div className="hidden lg:block"><ConversationPanel convos={convos} setConvos={setConvos} onNew={newChat} /></div>

      {/* RIGHT PANEL */}
      <Card className="flex min-h-0 flex-col overflow-hidden rounded-3xl border-border/60">
        {/* header */}
        <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
          <Sheet>
            <SheetTrigger asChild><Button variant="ghost" size="icon" className="lg:hidden"><PanelLeft className="h-5 w-5" /></Button></SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0"><ConversationPanel convos={convos} setConvos={setConvos} onNew={newChat} /></SheetContent>
          </Sheet>
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow"><Bot className="h-5 w-5" /></span>
          <div className="min-w-0 flex-1">
            <p className="font-display font-bold">Nurture AI</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1 text-success"><span className="h-1.5 w-1.5 rounded-full bg-success" /> Online</span>
              <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Medical Knowledge</span>
              <span className="flex items-center gap-1"><Mic className="h-3 w-3" /> Voice Ready</span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="hidden rounded-xl sm:flex" onClick={() => setVoiceOpen(true)}><Mic className="mr-1 h-4 w-4" /> Voice</Button>
          <Button variant="outline" size="sm" className="hidden rounded-xl sm:flex" onClick={() => setUploadOpen(true)}><Upload className="mr-1 h-4 w-4" /> Upload</Button>
          <Button variant="ghost" size="icon" onClick={newChat}><Plus className="h-5 w-5" /></Button>
        </div>

        {/* chat area */}
        <ScrollArea className="min-h-0 flex-1">
          <div ref={scrollRef} className="space-y-5 p-4 sm:p-6">
            {messages.length === 0 && !thinking && <EmptyChat onPick={send} />}
            {messages.map((m) => m.role === "user"
              ? <UserBubble key={m.id} text={m.text!} time={m.time} />
              : <AIBubble key={m.id} msg={m} onRegenerate={() => send("regenerate")} />)}
            {thinking && <ThinkingBubble />}
          </div>
        </ScrollArea>

        {/* smart actions + suggestions */}
        <div className="border-t border-border/60 px-4 pt-3">
          <div className="flex flex-wrap gap-2 pb-2">
            {smartActions.map((a) => (
              <button key={a.label} onClick={() => send(a.label)} className="flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 py-1.5 text-xs font-medium transition hover:bg-accent hover:text-primary">
                <a.icon className="h-3.5 w-3.5" /> {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* composer */}
        <div className="p-4 pt-2">
          <div className="flex items-end gap-2 rounded-2xl border border-border/60 bg-card p-2 shadow-soft focus-within:border-primary/40">
            <Button variant="ghost" size="icon" className="shrink-0" onClick={() => setUploadOpen(true)}><Upload className="h-5 w-5" /></Button>
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder="Ask Nurture anything about your journey…"
              className="max-h-32 min-h-[42px] resize-none border-0 bg-transparent p-2 shadow-none focus-visible:ring-0"
              rows={1}
            />
            <Button variant="ghost" size="icon" className="shrink-0" onClick={() => setVoiceOpen(true)}><Mic className="h-5 w-5" /></Button>
            <Button size="icon" className="shrink-0 rounded-xl bg-gradient-primary" onClick={() => send(input)} disabled={!input.trim()}><Send className="h-4 w-4" /></Button>
          </div>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">Nurture AI provides supportive guidance, not medical diagnosis.</p>
        </div>
      </Card>

      <Dialog open={voiceOpen} onOpenChange={setVoiceOpen}>
        <DialogContent className="max-w-full border-0 bg-transparent p-0 shadow-none sm:max-w-lg">
          <VoiceMode onClose={() => setVoiceOpen(false)} />
        </DialogContent>
      </Dialog>

      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
    </div>
  );
}

function ConversationPanel({ convos, setConvos, onNew }: { convos: typeof seedConversations; setConvos: (c: typeof seedConversations) => void; onNew: () => void }) {
  const [q, setQ] = useState("");
  const groups = ["Today", "Yesterday", "Last Week"] as const;
  const filtered = convos.filter((c) => c.title.toLowerCase().includes(q.toLowerCase()));
  const del = (id: string) => { setConvos(convos.filter((c) => c.id !== id)); toast.success("Conversation deleted"); };
  const pin = (id: string) => setConvos(convos.map((c) => c.id === id ? { ...c, pinned: !c.pinned } : c));

  return (
    <Card className="flex h-full flex-col rounded-3xl border-border/60">
      <div className="p-4">
        <Button onClick={onNew} className="w-full rounded-xl bg-gradient-primary shadow-glow"><Plus className="mr-1 h-4 w-4" /> New Chat</Button>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search conversations" className="h-10 rounded-xl pl-9" />
        </div>
      </div>
      <ScrollArea className="min-h-0 flex-1 px-3 pb-4">
        {filtered.some((c) => c.pinned) && (
          <>
            <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Pinned</p>
            {filtered.filter((c) => c.pinned).map((c) => <ConvoRow key={c.id} c={c} onPin={pin} onDelete={del} />)}
          </>
        )}
        {groups.map((g) => {
          const items = filtered.filter((c) => c.group === g && !c.pinned);
          if (!items.length) return null;
          return (
            <div key={g}>
              <p className="px-2 py-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{g}</p>
              {items.map((c) => <ConvoRow key={c.id} c={c} onPin={pin} onDelete={del} />)}
            </div>
          );
        })}
      </ScrollArea>
    </Card>
  );
}

function ConvoRow({ c, onPin, onDelete }: { c: typeof seedConversations[number]; onPin: (id: string) => void; onDelete: (id: string) => void }) {
  return (
    <div className="group flex items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-accent">
      <button className="min-w-0 flex-1 truncate text-left text-sm">{c.pinned && <Pin className="mr-1 inline h-3 w-3 text-primary" />}{c.title}</button>
      <button onClick={() => onPin(c.id)} className="opacity-0 transition group-hover:opacity-100"><Pin className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" /></button>
      <button onClick={() => onDelete(c.id)} className="opacity-0 transition group-hover:opacity-100"><Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" /></button>
    </div>
  );
}

function EmptyChat({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-primary text-primary-foreground shadow-glow animate-float"><Bot className="h-10 w-10" /></span>
      <h2 className="mt-5 font-display text-2xl font-extrabold">Hello 👋 I'm Nurture AI</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">I'm here to support your pregnancy and postpartum journey. You can ask me anything about pregnancy, nutrition, baby development, mental wellness and postpartum recovery.</p>
      <div className="mt-6 flex w-full max-w-2xl flex-wrap justify-center gap-2">
        {suggestedQuestions.map((s) => (
          <button key={s} onClick={() => onPick(s)} className="rounded-2xl border border-border/60 bg-card px-4 py-2.5 text-sm transition card-hover hover:border-primary/40 hover:text-primary">{s}</button>
        ))}
      </div>
    </div>
  );
}

function UserBubble({ text, time }: { text: string; time: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%]">
        <div className="rounded-2xl rounded-tr-md bg-gradient-primary px-4 py-3 text-sm text-primary-foreground shadow-soft">{text}</div>
        <p className="mt-1 text-right text-[10px] text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}

function ThinkingBubble() {
  return (
    <div className="flex items-start gap-3">
      <Avatar className="h-8 w-8"><AvatarFallback className="bg-gradient-primary text-primary-foreground"><Bot className="h-4 w-4" /></AvatarFallback></Avatar>
      <div className="rounded-2xl rounded-tl-md border border-border/60 bg-card px-4 py-3">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex gap-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
          </span>
          Thinking…
        </span>
      </div>
    </div>
  );
}

function AIBubble({ msg, onRegenerate }: { msg: Msg; onRegenerate: () => void }) {
  const ai = msg.ai!;
  const [liked, setLiked] = useState<"up" | "down" | null>(null);
  return (
    <div className="flex items-start gap-3">
      <Avatar className="h-8 w-8 shrink-0"><AvatarFallback className="bg-gradient-primary text-primary-foreground"><Bot className="h-4 w-4" /></AvatarFallback></Avatar>
      <div className="min-w-0 max-w-[85%] flex-1">
        {ai.emergency && <EmergencyResponse />}
        <div className={cn("rounded-2xl rounded-tl-md border bg-card px-4 py-3 shadow-soft", msg.streaming && "animate-fade-up")}>
          <p className="text-sm leading-relaxed">
            {ai.main}
            {msg.streaming && <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-primary align-middle" />}
          </p>
          {!msg.streaming && (
            <Accordion type="multiple" className="mt-3 space-y-2">
              <Section value="hl" label="Key Highlights" tone="accent"><ul className="space-y-1.5">{ai.highlights.map((h, i) => <li key={i} className="flex gap-2 text-sm"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />{h}</li>)}</ul></Section>
              <Section value="rem" label="Things to Remember" tone="accent"><ul className="space-y-1.5">{ai.remember.map((h, i) => <li key={i} className="flex gap-2 text-sm"><Bookmark className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />{h}</li>)}</ul></Section>
              <Section value="warn" label="Warning" tone="warning"><p className="text-sm text-muted-foreground">{ai.warning}</p></Section>
              <Section value="next" label="Suggested Next Questions" tone="accent"><ul className="space-y-1.5">{ai.nextQuestions.map((h, i) => <li key={i} className="text-sm text-primary">→ {h}</li>)}</ul></Section>
              <Section value="ref" label="References" tone="accent"><ul className="space-y-1 text-xs text-muted-foreground">{ai.references.map((r, i) => <li key={i}>📚 {r}</li>)}</ul></Section>
            </Accordion>
          )}
          <p className="mt-3 rounded-lg bg-muted/50 px-3 py-2 text-[11px] text-muted-foreground">⚕️ This is general guidance and not a medical diagnosis. Always consult your healthcare provider.</p>
        </div>
        {!msg.streaming && (
          <div className="mt-2 flex flex-wrap items-center gap-1">
            <ActionBtn icon={Copy} label="Copy" onClick={() => { navigator.clipboard?.writeText(ai.main); toast.success("Copied"); }} />
            <ActionBtn icon={ThumbsUp} active={liked === "up"} onClick={() => setLiked("up")} />
            <ActionBtn icon={ThumbsDown} active={liked === "down"} onClick={() => setLiked("down")} />
            <ActionBtn icon={RefreshCw} onClick={onRegenerate} />
            <ActionBtn icon={Volume2} onClick={() => toast.success("Reading response aloud…")} />
            <ActionBtn icon={Share2} onClick={() => toast.success("Share link copied")} />
            <ActionBtn icon={Bookmark} onClick={() => toast.success("Bookmarked")} />
            <ActionBtn icon={Languages} onClick={() => toast.success("Translating…")} />
            <span className="ml-1 text-[10px] text-muted-foreground">{msg.time}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ value, label, tone, children }: { value: string; label: string; tone: "accent" | "warning"; children: React.ReactNode }) {
  return (
    <AccordionItem value={value} className={cn("rounded-xl border px-3", tone === "warning" ? "border-warning/40 bg-warning/5" : "border-border/60 bg-muted/30")}>
      <AccordionTrigger className="py-2.5 text-xs font-semibold uppercase tracking-wide hover:no-underline">{label}</AccordionTrigger>
      <AccordionContent className="pb-3">{children}</AccordionContent>
    </AccordionItem>
  );
}
function ActionBtn({ icon: Icon, label, onClick, active }: { icon: typeof Copy; label?: string; onClick?: () => void; active?: boolean }) {
  return (
    <button onClick={onClick} className={cn("flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-muted-foreground transition hover:bg-accent hover:text-primary", active && "bg-accent text-primary")}>
      <Icon className="h-3.5 w-3.5" />{label}
    </button>
  );
}
function EmergencyResponse() {
  return (
    <Card className="mb-2 rounded-2xl border-destructive/40 bg-destructive/5 p-4">
      <div className="flex items-center gap-2 text-destructive"><AlertTriangle className="h-5 w-5" /><h4 className="font-display font-bold">This may need urgent attention</h4></div>
      <p className="mt-1 text-sm text-muted-foreground">Please don't wait. Contact your doctor or local emergency services right away.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" variant="destructive" className="rounded-xl"><Phone className="mr-1 h-4 w-4" /> Emergency Contact</Button>
        <Button size="sm" variant="outline" className="rounded-xl"><MapPin className="mr-1 h-4 w-4" /> Find Hospital</Button>
        <Button size="sm" variant="outline" className="rounded-xl"><Stethoscope className="mr-1 h-4 w-4" /> Call Doctor</Button>
      </div>
    </Card>
  );
}

function UploadDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const start = () => {
    setUploading(true); setProgress(0);
    const t = setInterval(() => setProgress((p) => {
      if (p >= 100) { clearInterval(t); setUploading(false); toast.success("Report uploaded & analyzed ✓"); return 100; }
      return p + 12;
    }), 200);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl sm:max-w-md">
        <h3 className="font-display text-lg font-bold">Upload Report</h3>
        <p className="text-sm text-muted-foreground">Prescription, blood report, ultrasound, lab report — PDF or image.</p>
        <button onClick={start} className="mt-3 flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border py-10 transition hover:border-primary/50 hover:bg-accent">
          <Upload className="h-8 w-8 text-primary" />
          <p className="text-sm font-medium">Drag & drop or click to upload</p>
          <p className="text-xs text-muted-foreground">Max 20MB · PDF, JPG, PNG</p>
        </button>
        {uploading && <div className="mt-3"><div className="h-2 w-full overflow-hidden rounded-full bg-muted"><div className="h-full bg-gradient-primary transition-all" style={{ width: `${progress}%` }} /></div><p className="mt-1 text-xs text-muted-foreground">{progress}%</p></div>}
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent Uploads</p>
          {["Blood Report - Jun 20", "Ultrasound - Jun 20"].map((r) => (
            <div key={r} className="mt-2 flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2 text-sm"><Upload className="h-4 w-4 text-primary" /> {r}</div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
