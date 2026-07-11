import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  User, HeartPulse, Stethoscope, Siren, Settings2, ArrowLeft, ArrowRight, Check, Baby,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Logo } from "@/components/Logo";
import { useAuthStore, type JourneyStage } from "@/store/authStore";
import { languages } from "@/services/mockData";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Set Up Your Profile — Nurture" }] }),
  component: Onboarding,
});

const stepsMeta = [
  { icon: User, title: "Personal Details" },
  { icon: HeartPulse, title: "Pregnancy Status" },
  { icon: Stethoscope, title: "Medical Information" },
  { icon: Siren, title: "Emergency" },
  { icon: Settings2, title: "Preferences" },
];

function Onboarding() {
  const navigate = useNavigate();
  const { completeOnboarding, user } = useAuthStore();
  const [step, setStep] = useState(0);
  const [d, setD] = useState<Record<string, string | boolean | number>>({
    fullName: user?.fullName ?? "", age: "", country: "United States", language: "English",
    stage: "pregnant", currentWeek: "", dueDate: "", previousPregnancy: false,
    babyAgeWeeks: "", deliveryType: "Vaginal", breastfeeding: true,
    height: "", weight: "", conditions: "", allergies: "", medications: "", doctor: "", hospital: "",
    emergencyContact: "", emergencyRelationship: "", bloodGroup: "O+",
    dailyReminder: true, waterReminder: true, medicineReminder: true, weeklyReports: true,
  });
  const upd = (k: string, v: string | boolean | number) => setD((p) => ({ ...p, [k]: v }));

  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));
  const finish = () => {
    completeOnboarding({
      fullName: String(d.fullName) || user?.fullName,
      age: Number(d.age) || undefined,
      country: String(d.country),
      language: String(d.language),
      stage: d.stage as JourneyStage,
      currentWeek: Number(d.currentWeek) || 26,
      dueDate: String(d.dueDate) || undefined,
      previousPregnancy: Boolean(d.previousPregnancy),
      babyAgeWeeks: Number(d.babyAgeWeeks) || 6,
      deliveryType: String(d.deliveryType),
      breastfeeding: Boolean(d.breastfeeding),
      height: Number(d.height) || undefined,
      weight: Number(d.weight) || undefined,
      bloodGroup: String(d.bloodGroup),
      conditions: String(d.conditions),
      allergies: String(d.allergies),
      medications: String(d.medications),
      doctor: String(d.doctor),
      hospital: String(d.hospital),
      emergencyContact: String(d.emergencyContact),
      emergencyRelationship: String(d.emergencyRelationship),
    });
    toast.success("Profile complete! Welcome to Nurture 🌸");
    navigate({ to: "/app" });
  };

  const progress = ((step + 1) / 5) * 100;
  const StepIcon = stepsMeta[step].icon;

  return (
    <div className="min-h-screen bg-muted/30 px-5 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <Logo />
          <span className="text-sm text-muted-foreground">Step {step + 1} of 5</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="mt-3 flex justify-between">
          {stepsMeta.map((s, i) => (
            <div key={i} className={`flex flex-col items-center gap-1 ${i <= step ? "text-primary" : "text-muted-foreground"}`}>
              <span className={`grid h-9 w-9 place-items-center rounded-xl border ${i < step ? "border-primary bg-primary text-primary-foreground" : i === step ? "border-primary bg-accent" : "border-border"}`}>
                {i < step ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
              </span>
              <span className="hidden text-[10px] font-medium sm:block">{s.title}</span>
            </div>
          ))}
        </div>

        <Card className="mt-6 rounded-3xl border-border/60 p-6 shadow-soft sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow"><StepIcon className="h-5 w-5" /></span>
            <h2 className="font-display text-xl font-bold">{stepsMeta[step].title}</h2>
          </div>

          <div className="animate-fade-up space-y-4">
            {step === 0 && (
              <>
                <TextField label="Full Name" value={String(d.fullName)} onChange={(v) => upd("fullName", v)} placeholder="Sarah Mitchell" />
                <TextField label="Age" type="number" value={String(d.age)} onChange={(v) => upd("age", v)} placeholder="29" />
                <TextField label="Country" value={String(d.country)} onChange={(v) => upd("country", v)} />
                <SelectField label="Preferred Language" value={String(d.language)} onChange={(v) => upd("language", v)} options={languages} />
              </>
            )}

            {step === 1 && (
              <>
                <Label>Are you currently</Label>
                <div className="grid grid-cols-2 gap-3">
                  {(["pregnant", "postpartum"] as const).map((s) => (
                    <button key={s} type="button" onClick={() => upd("stage", s)} className={`rounded-2xl border p-4 text-left transition ${d.stage === s ? "border-primary bg-accent shadow-soft" : "border-border hover:border-primary/40"}`}>
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">{s === "pregnant" ? <HeartPulse className="h-5 w-5" /> : <Baby className="h-5 w-5" />}</span>
                      <p className="mt-2 font-semibold capitalize">{s === "pregnant" ? "Pregnant" : "Postpartum Mother"}</p>
                      <p className="text-xs text-muted-foreground">{s === "pregnant" ? "Expecting a baby" : "After childbirth"}</p>
                    </button>
                  ))}
                </div>
                {d.stage === "pregnant" ? (
                  <div className="space-y-4 pt-2">
                    <TextField label="Current Week" type="number" value={String(d.currentWeek)} onChange={(v) => upd("currentWeek", v)} placeholder="26" />
                    <TextField label="Expected Delivery Date" type="date" value={String(d.dueDate)} onChange={(v) => upd("dueDate", v)} />
                    <ToggleRow label="Previous Pregnancy" checked={Boolean(d.previousPregnancy)} onChange={(v) => upd("previousPregnancy", v)} />
                  </div>
                ) : (
                  <div className="space-y-4 pt-2">
                    <TextField label="Baby Age (weeks)" type="number" value={String(d.babyAgeWeeks)} onChange={(v) => upd("babyAgeWeeks", v)} placeholder="6" />
                    <SelectField label="Delivery Type" value={String(d.deliveryType)} onChange={(v) => upd("deliveryType", v)} options={["Vaginal", "C-Section"]} />
                    <ToggleRow label="Breastfeeding" checked={Boolean(d.breastfeeding)} onChange={(v) => upd("breastfeeding", v)} />
                  </div>
                )}
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <TextField label="Height (cm)" type="number" value={String(d.height)} onChange={(v) => upd("height", v)} placeholder="165" />
                  <TextField label="Weight (kg)" type="number" value={String(d.weight)} onChange={(v) => upd("weight", v)} placeholder="68" />
                </div>
                <TextField label="Medical Conditions" value={String(d.conditions)} onChange={(v) => upd("conditions", v)} placeholder="None" />
                <TextField label="Allergies" value={String(d.allergies)} onChange={(v) => upd("allergies", v)} placeholder="Penicillin" />
                <TextField label="Current Medicines" value={String(d.medications)} onChange={(v) => upd("medications", v)} placeholder="Prenatal vitamins" />
                <div className="grid grid-cols-2 gap-3">
                  <TextField label="Doctor Name" value={String(d.doctor)} onChange={(v) => upd("doctor", v)} placeholder="Dr. Emily Carter" />
                  <TextField label="Hospital" value={String(d.hospital)} onChange={(v) => upd("hospital", v)} placeholder="St. Mary's" />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <TextField label="Emergency Contact" value={String(d.emergencyContact)} onChange={(v) => upd("emergencyContact", v)} placeholder="+1 (415) 555-0199" />
                <TextField label="Relationship" value={String(d.emergencyRelationship)} onChange={(v) => upd("emergencyRelationship", v)} placeholder="Husband" />
                <SelectField label="Blood Group" value={String(d.bloodGroup)} onChange={(v) => upd("bloodGroup", v)} options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]} />
              </>
            )}

            {step === 4 && (
              <>
                <ToggleRow label="Daily Reminder" checked={Boolean(d.dailyReminder)} onChange={(v) => upd("dailyReminder", v)} />
                <ToggleRow label="Water Reminder" checked={Boolean(d.waterReminder)} onChange={(v) => upd("waterReminder", v)} />
                <ToggleRow label="Medicine Reminder" checked={Boolean(d.medicineReminder)} onChange={(v) => upd("medicineReminder", v)} />
                <ToggleRow label="Weekly Reports" checked={Boolean(d.weeklyReports)} onChange={(v) => upd("weeklyReports", v)} />
                <SelectField label="Language" value={String(d.language)} onChange={(v) => upd("language", v)} options={languages} />
              </>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <Button variant="ghost" onClick={back} disabled={step === 0} className="rounded-xl"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Button>
            {step < 4 ? (
              <Button onClick={next} className="rounded-xl bg-gradient-primary shadow-glow">Continue <ArrowRight className="ml-1 h-4 w-4" /></Button>
            ) : (
              <Button onClick={finish} className="rounded-xl bg-gradient-primary shadow-glow">Finish <Check className="ml-1 h-4 w-4" /></Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function TextField({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-1.5 h-11 rounded-xl" />
    </div>
  );
}
function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="mt-1.5 h-11 rounded-xl"><SelectValue /></SelectTrigger>
        <SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}
function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3">
      <span className="text-sm font-medium">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
