import { useEffect, useState, useRef } from "react";
import { Mic, MicOff, PhoneOff, RotateCcw, Settings2, Volume2, Square, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

type State = "idle" | "listening" | "thinking" | "speaking";

export function VoiceMode({ 
  onClose,
  onSend
}: { 
  onClose: () => void;
  onSend: (text: string) => void;
}) {
  const [state, setState] = useState<State>("idle");
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  
  // Real recording states
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [transcribedText, setTranscribedText] = useState("");
  const [countdown, setCountdown] = useState<number | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<any>(null);

  // Recording elapsed timer
  useEffect(() => {
    if (state !== "listening") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    setSeconds(0);
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state]);

  // Automatic countdown handler
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      handleSend();
      return;
    }
    const t = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // Cleanup stream and audio context on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    if (typeof window === "undefined") return;
    try {
      setTranscribedText("");
      setCountdown(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      const chunks: Blob[] = [];

      // Set up Audio Analyser for Silence Detection
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let silenceStart = Date.now();
      let isSilent = false;

      const checkSilence = () => {
        if (recorder.state !== "recording") return;
        
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;

        // If average frequency level is below threshold, count as silence
        if (average < 10) {
          if (!isSilent) {
            silenceStart = Date.now();
            isSilent = true;
          } else if (Date.now() - silenceStart > 2500) {
            // Automatically stop after 2.5 seconds of silence
            console.log("[Silence Detection] Stopping due to silence...");
            recorder.stop();
            return;
          }
        } else {
          isSilent = false;
        }

        requestAnimationFrame(checkSilence);
      };

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        // Clean up audio tracks & context
        stream.getTracks().forEach((track) => track.stop());
        if (audioContext.state !== "closed") {
          audioContext.close();
        }

        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        if (audioBlob.size === 0) {
          setState("idle");
          return;
        }

        setState("thinking");

        try {
          const formData = new FormData();
          formData.append("file", audioBlob, "recording.webm");

          const response = await fetch("http://localhost:8000/speech-to-text", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`STT failed with status ${response.status}`);
          }

          const resJson = await response.json();
          const text = resJson.text || "";

          if (!text.trim()) {
            setState("idle");
            alert("No speech detected. Please speak clearly.");
            return;
          }

          setTranscribedText(text);
          setState("idle");
          setCountdown(3); // Start automatic submission timer
        } catch (err) {
          console.error("STT network error:", err);
          setState("idle");
          alert("Could not transcribe speech. Verify the Python backend is running.");
        }
      };

      setMediaRecorder(recorder);
      recorder.start();
      setState("listening");
      requestAnimationFrame(checkSilence);
    } catch (err) {
      console.error("Microphone capture error:", err);
      alert("Microphone permission denied. Enable microphone access in your browser settings.");
      setState("idle");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
  };

  const resetRecording = () => {
    stopRecording();
    setTranscribedText("");
    setCountdown(null);
    setState("idle");
    setSeconds(0);
  };

  const handleSend = () => {
    if (transcribedText.trim()) {
      onSend(transcribedText);
      setTranscribedText("");
      setCountdown(null);
      onClose();
    }
  };

  const cancelCountdown = () => {
    setCountdown(null);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTranscribedText(e.target.value);
    setCountdown(null); // Cancel countdown as soon as the user starts typing
  };

  const labelMap: Record<State, string> = {
    idle: transcribedText ? "Review and send your message" : "Tap the mic to talk with Nurture",
    listening: "Listening…",
    thinking: "Thinking…",
    speaking: "Speaking…",
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-primary to-[oklch(0.35_0.12_265)] p-8 text-center text-primary-foreground">
      <p className="text-sm font-medium uppercase tracking-widest text-primary-foreground/70">Voice Conversation</p>

      {/* Orb */}
      <div className="relative mx-auto my-8 grid h-44 w-44 place-items-center">
        {(state === "listening" || state === "speaking") && (
          <>
            <span className="absolute inset-0 rounded-full bg-white/20 animate-pulse-ring" />
            <span className="absolute inset-0 rounded-full bg-white/10 animate-pulse-ring [animation-delay:0.6s]" />
          </>
        )}
        <div className={`grid h-32 w-32 place-items-center rounded-full bg-white/15 backdrop-blur ${state !== "idle" ? "animate-float" : ""}`}>
          <div className="grid h-20 w-20 place-items-center rounded-full bg-white/25">
            {state === "thinking" ? (
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Mic className="h-9 w-9" />
            )}
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
              height: state === "idle" ? 4 : `${8 + Math.abs(Math.sin(i + seconds * 4)) * 28}px`,
              transition: "height 0.2s ease",
            }}
          />
        ))}
      </div>

      <p className="mt-6 font-display text-lg font-bold">{labelMap[state]}</p>
      
      {state === "listening" && (
        <p className="text-sm text-primary-foreground/70">
          {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
        </p>
      )}

      {/* Transcribed Text Review */}
      {transcribedText && (
        <div className="mx-auto mt-4 max-w-sm rounded-2xl bg-white/10 p-3 text-left border border-white/10">
          <p className="text-[10px] uppercase tracking-wider text-white/50 mb-1">Transcribed Text (Edit if needed)</p>
          <textarea
            value={transcribedText}
            onChange={handleTextChange}
            className="w-full bg-transparent text-xs text-white focus:outline-none resize-none h-16 scrollbar-none"
            placeholder="Edit text..."
          />
          {countdown !== null && (
            <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2 text-[11px]">
              <span className="text-primary-foreground/80 animate-pulse font-medium">Sending automatically in {countdown}s...</span>
              <Button size="sm" variant="ghost" className="h-5 rounded-md px-1.5 text-[10px] text-white hover:bg-white/10" onClick={cancelCountdown}>
                Hold & Edit
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-3">
        <Button 
          variant="secondary" 
          size="icon" 
          className="rounded-full bg-white/15 text-primary-foreground hover:bg-white/25" 
          onClick={() => setMuted(!muted)}
        >
          <Volume2 className="h-5 w-5" />
        </Button>
        
        {state === "listening" ? (
          <Button 
            size="icon" 
            className="h-16 w-16 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/95 shadow-glow" 
            onClick={stopRecording}
          >
            <Square className="h-6 w-6" />
          </Button>
        ) : transcribedText ? (
          <Button 
            size="icon" 
            className="h-16 w-16 rounded-full bg-white text-primary hover:bg-white/90 shadow-glow" 
            onClick={handleSend}
          >
            <Send className="h-6 w-6" />
          </Button>
        ) : (
          <Button 
            size="icon" 
            className="h-16 w-16 rounded-full bg-white text-primary hover:bg-white/90 shadow-glow" 
            onClick={startRecording}
            disabled={state === "thinking"}
          >
            <Mic className="h-6 w-6" />
          </Button>
        )}

        <Button 
          variant="secondary" 
          size="icon" 
          className="rounded-full bg-white/15 text-primary-foreground hover:bg-white/25" 
          onClick={resetRecording}
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <Button variant="ghost" size="sm" className="rounded-xl text-primary-foreground/80 hover:bg-white/10 hover:text-primary-foreground"><Settings2 className="mr-1 h-4 w-4" /> Settings</Button>
        <Button variant="destructive" size="sm" className="rounded-xl" onClick={onClose}><PhoneOff className="mr-1 h-4 w-4" /> End</Button>
      </div>
    </div>
  );
}
