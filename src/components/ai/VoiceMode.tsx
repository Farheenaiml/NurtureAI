import { useEffect, useState } from "react";
import { Mic, MicOff, PhoneOff, RotateCcw, Settings2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type State = "idle" | "listening" | "thinking" | "speaking";

export function VoiceMode({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<State>("idle");
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (state !== "listening") return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [state]);

  const start = () => {
    setState("listening"); setSeconds(0);
    setTimeout(() => setState("thinking"), 3000);
    setTimeout(() => setState("speaking"), 5000);
    setTimeout(() => setState("idle"), 9000);
  };

  const labelMap: Record<State, string> = {
    idle: "Tap the mic to talk with Nurture",
    listening: "Listening…",
    thinking: "Thinking…",
    speaking: "Speaking…",
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-primary to-[oklch(0.35_0.12_265)] p-8 text-center text-primary-foreground">
      <p className="text-sm font-medium uppercase tracking-widest text-primary-foreground/70">Voice Conversation</p>

      {/* Orb */}
      <div className="relative mx-auto my-10 grid h-44 w-44 place-items-center">
        {(state === "listening" || state === "speaking") && (
          <>
            <span className="absolute inset-0 rounded-full bg-white/20 animate-pulse-ring" />
            <span className="absolute inset-0 rounded-full bg-white/10 animate-pulse-ring [animation-delay:0.6s]" />
          </>
        )}
        <div className={`grid h-32 w-32 place-items-center rounded-full bg-white/15 backdrop-blur ${state !== "idle" ? "animate-float" : ""}`}>
          <div className="grid h-20 w-20 place-items-center rounded-full bg-white/25">
            {state === "thinking"
              ? <span className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
              : <Mic className="h-9 w-9" />}
          </div>
        </div>
      </div>

      {/* Waveform */}
      <div className="flex h-10 items-center justify-center gap-1">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="w-1 rounded-full bg-white/70"
            style={{
              height: state === "idle" ? 4 : `${8 + Math.abs(Math.sin(i + seconds)) * 28}px`,
              transition: "height 0.2s ease",
            }}
          />
        ))}
      </div>

      <p className="mt-6 font-display text-lg font-bold">{labelMap[state]}</p>
      {state === "listening" && <p className="text-sm text-primary-foreground/70">{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</p>}
      {state === "speaking" && <p className="mx-auto mt-2 max-w-xs text-sm text-primary-foreground/80">"Iron is important in your second trimester. Try lentils, spinach and lean meats with vitamin C."</p>}

      <div className="mt-8 flex items-center justify-center gap-3">
        <Button variant="secondary" size="icon" className="rounded-full bg-white/15 text-primary-foreground hover:bg-white/25" onClick={() => setMuted(!muted)}>
          {muted ? <MicOff className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
        <Button size="icon" className="h-16 w-16 rounded-full bg-white text-primary hover:bg-white/90" onClick={start}>
          <Mic className="h-6 w-6" />
        </Button>
        <Button variant="secondary" size="icon" className="rounded-full bg-white/15 text-primary-foreground hover:bg-white/25" onClick={start}>
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <Button variant="ghost" size="sm" className="rounded-xl text-primary-foreground/80 hover:bg-white/10 hover:text-primary-foreground"><Settings2 className="mr-1 h-4 w-4" /> Voice Settings</Button>
        <Button variant="destructive" size="sm" className="rounded-xl" onClick={onClose}><PhoneOff className="mr-1 h-4 w-4" /> End</Button>
      </div>
    </div>
  );
}
