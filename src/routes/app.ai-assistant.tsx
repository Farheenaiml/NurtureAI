import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  Bot, Send, Mic, Upload, Plus, Search, Pin, Trash2, MoreVertical, Copy, ThumbsUp, ThumbsDown,
  RefreshCw, Share2, Bookmark, Languages, Sparkles, ShieldCheck, Volume2, AlertTriangle,
  Phone, MapPin, Stethoscope, ChevronDown, PanelLeft, Check, FileText, Play, Pause, VolumeX, Square, RotateCcw
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
import { suggestedQuestions } from "@/services/mockData";
import type { AIResponse } from "../backend/mockFallback";
import {
  getConversationsServerFn,
  getMessagesServerFn,
  sendAIMessageServerFn,
  deleteConversationServerFn,
  togglePinConversationServerFn,
} from "../backend/aiServer";
import { VoiceMode } from "@/components/ai/VoiceMode";
import { toast } from "sonner";

export const Route = createFileRoute("/app/ai-assistant")({
  head: () => ({ meta: [{ title: "Nurture AI — Your Care Companion" }] }),
  component: AIAssistant,
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
  const [convos, setConvos] = useState<any[]>([]);
  const [activeConvoId, setActiveConvoId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [autoPlaySpeech, setAutoPlaySpeech] = useState(false);
  const [isLastSendVoice, setIsLastSendVoice] = useState(false);
  // Voice Recording inline states
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);

  const recMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recStreamRef = useRef<MediaStream | null>(null);
  const recAudioCtxRef = useRef<AudioContext | null>(null);
  const recTimerRef = useRef<any>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Global Audio Player states and refs
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const globalAudioRef = useRef<HTMLAudioElement | null>(null);
  const isFetchingAudioRef = useRef(false);

  const stopGlobalAudio = () => {
    if (globalAudioRef.current) {
      globalAudioRef.current.pause();
      globalAudioRef.current.currentTime = 0;
    }
    setIsPlayingAudio(false);
    setSpeakingText(null);
    setSpeakingMsgId(null);
  };

  const playGlobalAudio = async (text: string, msgId: string) => {
    if (speakingMsgId === msgId && globalAudioRef.current) {
      if (isPlayingAudio) {
        globalAudioRef.current.pause();
        setIsPlayingAudio(false);
      } else {
        globalAudioRef.current.play();
        setIsPlayingAudio(true);
      }
      return;
    }

    stopGlobalAudio();

    if (isFetchingAudioRef.current) return;
    isFetchingAudioRef.current = true;

    try {
      setSpeakingText(text);
      setSpeakingMsgId(msgId);
      const res = await fetch("http://localhost:8000/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      if (!res.ok) throw new Error("TTS generation failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const newAudio = new Audio(url);

      newAudio.onended = () => {
        setIsPlayingAudio(false);
        setSpeakingText(null);
        setSpeakingMsgId(null);
      };
      newAudio.onplay = () => {
        setIsPlayingAudio(true);
      };
      newAudio.onpause = () => {
        setIsPlayingAudio(false);
      };

      newAudio.muted = isAudioMuted;
      globalAudioRef.current = newAudio;
      newAudio.play();
      setIsPlayingAudio(true);
    } catch (err) {
      console.error("TTS playback failed:", err);
      toast.error("Text-to-speech playback failed.");
      setSpeakingText(null);
      setSpeakingMsgId(null);
      setIsPlayingAudio(false);
    } finally {
      isFetchingAudioRef.current = false;
    }
  };

  const replayGlobalAudio = () => {
    if (globalAudioRef.current) {
      globalAudioRef.current.currentTime = 0;
      globalAudioRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const toggleMuteGlobalAudio = () => {
    if (globalAudioRef.current) {
      const nextMute = !isAudioMuted;
      globalAudioRef.current.muted = nextMute;
      setIsAudioMuted(nextMute);
    } else {
      setIsAudioMuted(!isAudioMuted);
    }
  };

  // Cleanup timers, streams, and audios on unmount
  useEffect(() => {
    return () => {
      if (recTimerRef.current) clearInterval(recTimerRef.current);
      if (recStreamRef.current) {
        recStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recAudioCtxRef.current) {
        recAudioCtxRef.current.close();
      }
      if (globalAudioRef.current) {
        globalAudioRef.current.pause();
      }
    };
  }, []);

  // Trigger global autoplay when assistant message finishes streaming
  useEffect(() => {
    if (autoPlaySpeech && messages.length > 0) {
      const latestMsg = messages[messages.length - 1];
      if (latestMsg.role === "assistant" && !latestMsg.streaming && latestMsg.ai) {
        setAutoPlaySpeech(false); // Consume flag
        playGlobalAudio(latestMsg.ai.main, latestMsg.id);
      }
    }
  }, [messages, autoPlaySpeech]);

  const startRecordingVoice = async () => {
    if (typeof window === "undefined") return;
    try {
      setIsTranscribing(false);
      chunksRef.current = [];
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recStreamRef.current = stream;
      
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      recMediaRecorderRef.current = recorder;

      // Silence detection using AudioContext
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      recAudioCtxRef.current = audioContext;
      
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

        if (average < 10) {
          if (!isSilent) {
            silenceStart = Date.now();
            isSilent = true;
          } else if (Date.now() - silenceStart > 2500) {
            console.log("[Silence Detection] Auto-stopping due to silence...");
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
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        // Cleanup audio tracks and context
        stream.getTracks().forEach((track) => track.stop());
        if (audioContext.state !== "closed") {
          audioContext.close();
        }

        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        if (audioBlob.size === 0 || chunksRef.current.length === 0) {
          setIsRecording(false);
          return;
        }

        setIsTranscribing(true);

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

          if (text.trim()) {
            setInput(text);
            setIsLastSendVoice(true); // Flag that this input originated from voice
          } else {
            toast.error("No speech detected. Try again.");
          }
        } catch (err) {
          console.error("STT error:", err);
          toast.error("Could not transcribe speech.");
        } finally {
          setIsTranscribing(false);
          setIsRecording(false);
        }
      };

      recorder.start();
      setIsRecording(true);
      setRecSeconds(0);
      
      if (recTimerRef.current) clearInterval(recTimerRef.current);
      recTimerRef.current = setInterval(() => setRecSeconds((s) => s + 1), 1000);

      requestAnimationFrame(checkSilence);
    } catch (err) {
      console.error("Microphone access error:", err);
      toast.error("Microphone permission denied.");
      setIsRecording(false);
    }
  };

  const cancelRecordingVoice = () => {
    chunksRef.current = [];
    if (recMediaRecorderRef.current && recMediaRecorderRef.current.state === "recording") {
      recMediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (recTimerRef.current) clearInterval(recTimerRef.current);
  };

  const stopRecordingVoice = () => {
    if (recMediaRecorderRef.current && recMediaRecorderRef.current.state === "recording") {
      recMediaRecorderRef.current.stop();
    }
    if (recTimerRef.current) clearInterval(recTimerRef.current);
  };
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [selectedFile, setSelectedFile] = useState<{ base64: string; mimeType: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchConvos = async () => {
    try {
      const list = await getConversationsServerFn();
      setConvos(list);
    } catch (e) {
      console.error("Failed to load conversations", e);
    }
  };

  const fetchMessages = async (id: string) => {
    try {
      setThinking(true);
      const msgs = await getMessagesServerFn({ data: id });
      setMessages(msgs);
    } catch (e) {
      console.error("Failed to load messages", e);
    } finally {
      setThinking(false);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
    fetchConvos();
  }, []);

  useEffect(() => {
    if (activeConvoId) {
      fetchMessages(activeConvoId);
    } else {
      setMessages([]);
    }
  }, [activeConvoId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setSelectedFile({
        base64,
        mimeType: file.type,
        name: file.name
      });
      toast.success(`Attached ${file.name}`);
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
    };
    reader.readAsDataURL(file);
  };

  const send = async (text: string) => {
    if (!text.trim() && !selectedFile) return;

    // Stop any active spoken audio before sending a new query
    stopGlobalAudio();

    // Determine if we should autoplay the reply based on the voice flag
    if (isLastSendVoice) {
      setAutoPlaySpeech(true);
      setIsLastSendVoice(false); // Reset flag
    } else {
      setAutoPlaySpeech(false);
    }

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = { 
      id: crypto.randomUUID(), 
      role: "user" as const, 
      text, 
      time: now,
      fileName: selectedFile?.name,
      fileType: selectedFile?.mimeType,
      fileData: selectedFile?.base64
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    const fileToSend = selectedFile;
    setSelectedFile(null);
    setThinking(true);

    try {
      const res = await sendAIMessageServerFn({
        data: {
          prompt: text,
          conversationId: activeConvoId,
          file: fileToSend || undefined
        }
      });

      const newMsg = {
        id: res.message.id,
        role: "assistant" as const,
        ai: res.message.ai,
        time: res.message.time,
        streaming: true
      };

      setMessages((m) => [...m.filter(x => x.id !== newMsg.id), newMsg]);
      setTimeout(() => setMessages((m) => m.map((x) => x.id === newMsg.id ? { ...x, streaming: false } : x)), 1400);

      if (!activeConvoId) {
        setActiveConvoId(res.conversationId);
      }
      fetchConvos();
    } catch (e) {
      toast.error("Failed to send message.");
    } finally {
      setThinking(false);
    }
  };

  const newChat = () => {
    setActiveConvoId(undefined);
    setMessages([]);
    toast.success("Started a new chat");
    inputRef.current?.focus();
  };

  const handlePin = async (id: string) => {
    try {
      await togglePinConversationServerFn({ data: id });
      fetchConvos();
    } catch (e) {
      toast.error("Failed to pin conversation");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteConversationServerFn({ data: id });
      if (activeConvoId === id) {
        setActiveConvoId(undefined);
      }
      fetchConvos();
      toast.success("Conversation deleted");
    } catch (e) {
      toast.error("Failed to delete conversation");
    }
  };

  return (
    <div className="grid h-[calc(100vh-8rem)] grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
      {/* LEFT PANEL (desktop) */}
      <div className="hidden lg:block">
        <ConversationPanel
          convos={convos}
          activeConvoId={activeConvoId}
          onSelect={setActiveConvoId}
          onPin={handlePin}
          onDelete={handleDelete}
          onNew={newChat}
        />
      </div>

      {/* RIGHT PANEL */}
      <Card className="flex min-h-0 flex-col overflow-hidden rounded-3xl border-border/60">
        {/* header */}
        <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
          <Sheet>
            <SheetTrigger asChild><Button variant="ghost" size="icon" className="lg:hidden"><PanelLeft className="h-5 w-5" /></Button></SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <ConversationPanel
                convos={convos}
                activeConvoId={activeConvoId}
                onSelect={setActiveConvoId}
                onPin={handlePin}
                onDelete={handleDelete}
                onNew={newChat}
              />
            </SheetContent>
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
          <Button variant="outline" size="sm" className="hidden rounded-xl sm:flex" onClick={startRecordingVoice}><Mic className="mr-1 h-4 w-4" /> Voice</Button>
          <Button variant="outline" size="sm" className="hidden rounded-xl sm:flex" onClick={triggerUpload}><Upload className="mr-1 h-4 w-4" /> Upload</Button>
          <Button variant="ghost" size="icon" onClick={newChat}><Plus className="h-5 w-5" /></Button>
        </div>

        {/* chat area */}
        <ScrollArea className="min-h-0 flex-1">
          <div ref={scrollRef} className="space-y-5 p-4 sm:p-6">
            {messages.length === 0 && !thinking && <EmptyChat onPick={send} />}
            {messages.map((m, index) => {
              const isLast = index === messages.length - 1;
              return m.role === "user" ? (
                <UserBubble key={m.id} text={m.text!} time={m.time} fileName={(m as any).fileName} fileType={(m as any).fileType} fileData={(m as any).fileData} />
              ) : (
                <AIBubble 
                  key={m.id} 
                  msg={m} 
                  onRegenerate={() => send("regenerate")} 
                  speakingMsgId={speakingMsgId}
                  speakingText={speakingText}
                  isPlayingAudio={isPlayingAudio}
                  isAudioMuted={isAudioMuted}
                  onPlayPause={playGlobalAudio}
                  onStop={stopGlobalAudio}
                  onReplay={replayGlobalAudio}
                  onMuteToggle={toggleMuteGlobalAudio}
                />
              );
            })}
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
          {speakingText && (
            <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 text-sm shadow-soft animate-fade-in">
              <div className="flex items-center gap-2 text-primary font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="truncate max-w-[200px] sm:max-w-xs text-xs font-semibold">Speaking response...</span>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-lg text-primary hover:bg-primary/10" 
                  onClick={() => playGlobalAudio(speakingText || "", speakingMsgId || "")}
                >
                  {isPlayingAudio ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive" 
                  onClick={stopGlobalAudio}
                >
                  <Square className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          {selectedFile && (
            <div className="mb-2 flex items-center gap-2 rounded-xl bg-accent px-3 py-1.5 text-xs text-primary max-w-max">
              <span className="truncate max-w-[200px] font-medium">{selectedFile.name}</span>
              <button onClick={() => setSelectedFile(null)} className="font-bold hover:text-destructive text-sm ml-1">×</button>
            </div>
          )}
          
          {isRecording ? (
            /* Recording active state: shows animated waveform, elapsed time, cancel and check buttons */
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-2 shadow-soft h-[58px]">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary animate-pulse">
                <Mic className="h-5 w-5" />
              </span>
              
              {/* Waveform visualizer */}
              <div className="flex-1 flex items-center justify-center gap-1 px-4 h-6 overflow-hidden">
                {Array.from({ length: 30 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-1 rounded-full bg-primary/70"
                    style={{
                      height: `${6 + Math.abs(Math.sin(i + recSeconds * 3)) * 22}px`,
                      transition: "height 0.15s ease",
                    }}
                  />
                ))}
              </div>
              
              {/* Elapsed time */}
              <span className="text-xs font-mono text-primary/80 px-2 shrink-0">
                {String(Math.floor(recSeconds / 60)).padStart(2, "0")}:{String(recSeconds % 60).padStart(2, "0")}
              </span>
              
              {/* Controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive" 
                  onClick={cancelRecordingVoice}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-xl text-primary hover:bg-primary/10" 
                  onClick={stopRecordingVoice}
                >
                  <Check className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ) : isTranscribing ? (
            /* Transcribing state */
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-muted/30 p-2 shadow-soft h-[58px]">
              <div className="flex-1 flex items-center justify-center gap-2 text-sm text-muted-foreground animate-pulse">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Transcribing voice note…
              </div>
            </div>
          ) : (
            /* Normal text compose state */
            <div className="flex items-end gap-2 rounded-2xl border border-border/60 bg-card p-2 shadow-soft focus-within:border-primary/40">
              <Button variant="ghost" size="icon" className="shrink-0" onClick={triggerUpload}><Upload className="h-5 w-5" /></Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,application/pdf"
                className="hidden"
              />
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
                placeholder="Ask Nurture anything about your journey…"
                className="max-h-32 min-h-[42px] resize-none border-0 bg-transparent p-2 shadow-none focus-visible:ring-0"
                rows={1}
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="shrink-0" 
                onClick={startRecordingVoice}
              >
                <Mic className="h-5 w-5" />
              </Button>
              <Button size="icon" className="shrink-0 rounded-xl bg-gradient-primary" onClick={() => send(input)} disabled={!input.trim() && !selectedFile}><Send className="h-4 w-4" /></Button>
            </div>
          )}
          <p className="mt-2 text-center text-[11px] text-muted-foreground">Nurture AI provides supportive guidance, not medical diagnosis.</p>
        </div>
      </Card>

      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
    </div>
  );
}

function ConversationPanel({
  convos,
  activeConvoId,
  onSelect,
  onPin,
  onDelete,
  onNew
}: {
  convos: any[];
  activeConvoId?: string;
  onSelect: (id: string) => void;
  onPin: (id: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}) {
  const [q, setQ] = useState("");
  const groups = ["Today", "Yesterday", "Last Week"] as const;
  const filtered = convos.filter((c) => c.title.toLowerCase().includes(q.toLowerCase()));

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
            {filtered.filter((c) => c.pinned).map((c) => (
              <ConvoRow
                key={c.id}
                c={c}
                active={activeConvoId === c.id}
                onSelect={onSelect}
                onPin={onPin}
                onDelete={onDelete}
              />
            ))}
          </>
        )}
        {groups.map((g) => {
          const items = filtered.filter((c) => c.group === g && !c.pinned);
          if (!items.length) return null;
          return (
            <div key={g}>
              <p className="px-2 py-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{g}</p>
              {items.map((c) => (
                <ConvoRow
                  key={c.id}
                  c={c}
                  active={activeConvoId === c.id}
                  onSelect={onSelect}
                  onPin={onPin}
                  onDelete={onDelete}
                />
              ))}
            </div>
          );
        })}
      </ScrollArea>
    </Card>
  );
}

function ConvoRow({
  c,
  active,
  onSelect,
  onPin,
  onDelete
}: {
  c: any;
  active: boolean;
  onSelect: (id: string) => void;
  onPin: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className={cn(
      "group flex items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-accent",
      active && "bg-accent text-primary font-medium"
    )}>
      <button onClick={() => onSelect(c.id)} className="min-w-0 flex-1 truncate text-left text-sm">
        {c.pinned && <Pin className="mr-1 inline h-3.5 w-3.5 text-primary fill-primary" />}
        {c.title}
      </button>
      <button onClick={() => onPin(c.id)} className="opacity-0 transition group-hover:opacity-100">
        <Pin className={cn("h-3.5 w-3.5 text-muted-foreground hover:text-primary", c.pinned && "text-primary fill-primary")} />
      </button>
      <button onClick={() => onDelete(c.id)} className="opacity-0 transition group-hover:opacity-100">
        <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
      </button>
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

function formatMessageText(text?: string) {
  if (!text) return null;
  const boldFormatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  return boldFormatted.split('\n').map((para, i) => {
    if (!para.trim()) return null;
    return (
      <p key={i} className="mb-2 last:mb-0 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: para }} />
    );
  });
}

function UserBubble({
  text,
  time,
  fileName,
  fileType,
  fileData
}: {
  text: string;
  time: string;
  fileName?: string;
  fileType?: string;
  fileData?: string;
}) {
  const isImage = fileType?.startsWith("image/");
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%]">
        <div className="rounded-2xl rounded-tr-md bg-gradient-primary px-4 py-3 text-sm text-primary-foreground shadow-soft">
          {fileName && fileData && (
            <div className="mb-2">
              {isImage ? (
                <img
                  src={`data:${fileType};base64,${fileData}`}
                  alt={fileName}
                  className="max-h-40 max-w-full rounded-lg border border-white/20 object-cover"
                />
              ) : (
                <div className="flex items-center gap-2 rounded-lg bg-white/10 p-2 text-xs">
                  <FileText className="h-4 w-4 shrink-0" />
                  <span className="truncate font-medium">{fileName}</span>
                </div>
              )}
            </div>
          )}
          <div>{text}</div>
        </div>
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

function AIBubble({ 
  msg, 
  onRegenerate,
  speakingMsgId,
  speakingText,
  isPlayingAudio,
  isAudioMuted,
  onPlayPause,
  onStop,
  onReplay,
  onMuteToggle
}: { 
  msg: Msg; 
  onRegenerate: () => void;
  speakingMsgId: string | null;
  speakingText: string | null;
  isPlayingAudio: boolean;
  isAudioMuted: boolean;
  onPlayPause: (text: string, msgId: string) => void;
  onStop: () => void;
  onReplay: () => void;
  onMuteToggle: () => void;
}) {
  const ai = msg.ai!;
  const [liked, setLiked] = useState<"up" | "down" | null>(null);

  const isThisBubbleSpeaking = speakingMsgId === msg.id;
  const isThisBubblePlaying = isThisBubbleSpeaking && isPlayingAudio;

  return (
    <div className="flex items-start gap-3">
      <Avatar className={cn("h-8 w-8 shrink-0 transition-all duration-300", isThisBubblePlaying && "ring-2 ring-primary ring-offset-2 animate-pulse")}>
        <AvatarFallback className="bg-gradient-primary text-primary-foreground">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      
      <div className="min-w-0 max-w-[85%] flex-1">
        {ai.emergency && <EmergencyResponse />}
        <div className={cn("rounded-2xl rounded-tl-md border bg-card px-4 py-3 shadow-soft", msg.streaming && "animate-fade-up")}>
          <div className="space-y-2">
            {formatMessageText(ai.main)}
            {msg.streaming && <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-primary align-middle" />}
          </div>
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
            
            {/* Live voice player action buttons */}
            {isThisBubbleSpeaking ? (
              <>
                <ActionBtn 
                  icon={isThisBubblePlaying ? Pause : Play} 
                  label={isThisBubblePlaying ? "Pause" : "Play"} 
                  onClick={() => onPlayPause(ai.main, msg.id)} 
                />
                <ActionBtn 
                  icon={isAudioMuted ? VolumeX : Volume2} 
                  label={isAudioMuted ? "Unmute" : "Mute"} 
                  onClick={onMuteToggle} 
                />
                <ActionBtn 
                  icon={RotateCcw} 
                  label="Replay" 
                  onClick={onReplay} 
                />
                <ActionBtn 
                  icon={Square} 
                  label="Stop" 
                  onClick={onStop} 
                />
              </>
            ) : (
              <ActionBtn icon={Volume2} label="Speak" onClick={() => onPlayPause(ai.main, msg.id)} />
            )}
            
            <ActionBtn icon={Share2} onClick={() => toast.success("Share link copied")} />
            <ActionBtn icon={Bookmark} onClick={() => toast.success("Bookmarked")} />
            <ActionBtn icon={Languages} onClick={() => toast.success("Translating…")} />
            <span className="ml-1 text-[10px] text-muted-foreground">{msg.time}</span>
            {isThisBubblePlaying && (
              <span className="text-[10px] text-primary animate-pulse font-semibold ml-2">
                ● Speaking...
              </span>
            )}
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
