import { createFileRoute } from "@tanstack/react-router";
import { Siren, Phone, MapPin, Navigation, Share2, Droplet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

export const Route = createFileRoute("/app/emergency")({
  head: () => ({ meta: [{ title: "Emergency SOS — Nurture" }] }),
  component: EmergencyPage,
});

const quickSymptoms = ["Heavy Bleeding", "Chest Pain", "Severe Headache", "Loss of Consciousness", "Reduced Baby Movement", "High Fever", "Difficulty Breathing"];

function EmergencyPage() {
  const user = useAuthStore((s) => s.user);
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader icon={Siren} title="Emergency SOS" subtitle="Calm, quick access to help" />
      <Card className="rounded-3xl border-destructive/30 bg-destructive/5 p-6">
        <p className="text-sm text-muted-foreground">If you believe you are experiencing a medical emergency, seek immediate medical attention or contact your local emergency services.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Button variant="destructive" className="h-14 rounded-2xl text-base" onClick={() => toast.success("Calling emergency contact…")}><Phone className="mr-2 h-5 w-5" /> Call Emergency Contact</Button>
          <Button variant="destructive" className="h-14 rounded-2xl text-base" onClick={() => toast.success("Calling hospital…")}><Phone className="mr-2 h-5 w-5" /> Call Hospital</Button>
          <Button variant="outline" className="h-14 rounded-2xl text-base" onClick={() => toast.success("Finding nearby hospitals…")}><MapPin className="mr-2 h-5 w-5" /> Find Nearby Hospital</Button>
          <Button variant="outline" className="h-14 rounded-2xl text-base" onClick={() => toast.success("Sharing live location…")}><Navigation className="mr-2 h-5 w-5" /> Share Live Location</Button>
        </div>
      </Card>
      <Card className="rounded-3xl border-border/60 p-6">
        <h3 className="mb-3 font-display font-bold">Emergency Medical Information</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {[["Blood Group", user?.bloodGroup ?? "—"], ["Allergies", user?.allergies ?? "—"], ["Medicines", user?.medications ?? "—"], ["Doctor", user?.doctor ?? "—"], ["Emergency Contact", user?.emergencyContact ?? "—"]].map(([k, v]) => (
            <div key={k} className="flex justify-between rounded-xl bg-muted/40 px-3 py-2.5 text-sm"><span className="text-muted-foreground">{k}</span><span className="truncate pl-2 font-medium">{v}</span></div>
          ))}
        </div>
      </Card>
      <Card className="rounded-3xl border-border/60 p-6">
        <h3 className="mb-3 font-display font-bold">Quick Emergency Symptoms</h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {quickSymptoms.map((s) => (
            <button key={s} onClick={() => toast.error(`${s}: Seek immediate care. Call emergency services.`)} className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-left text-sm font-medium text-destructive transition hover:bg-destructive/10">{s}</button>
          ))}
        </div>
      </Card>
    </div>
  );
}
