import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, Loader2, User, Phone, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthLayout, GoogleButton, Link } from "@/components/auth/AuthLayout";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create Account — Nurture" }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const signup = useAuthStore((s) => s.signup);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [agree, setAgree] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email.includes("@")) return setError("Please enter your name and a valid email.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    if (!agree) return setError("Please accept the Terms & Conditions.");
    setError("");
    setLoading(true);
    setTimeout(() => {
      signup(form.name, form.email, form.phone);
      toast.success("Account created — let's set up your profile!");
      navigate({ to: "/onboarding" });
    }, 1200);
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start your personalized maternal care journey today.">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Full Name" icon={User}><Input value={form.name} onChange={set("name")} placeholder="Sarah Mitchell" className="h-11 rounded-xl pl-9" /></Field>
        <Field label="Email" icon={Mail}><Input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" className="h-11 rounded-xl pl-9" /></Field>
        <Field label="Phone" icon={Phone}><Input value={form.phone} onChange={set("phone")} placeholder="+1 (415) 555-0123" className="h-11 rounded-xl pl-9" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Password" icon={Lock}>
            <Input type={show ? "text" : "password"} value={form.password} onChange={set("password")} placeholder="••••••" className="h-11 rounded-xl px-9" />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
          </Field>
          <Field label="Confirm" icon={Lock}><Input type={show ? "text" : "password"} value={form.confirm} onChange={set("confirm")} placeholder="••••••" className="h-11 rounded-xl pl-9" /></Field>
        </div>
        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <Checkbox checked={agree} onCheckedChange={(v) => setAgree(!!v)} className="mt-0.5" />
          I agree to the <a href="#" className="text-primary hover:underline">Terms & Conditions</a> and Privacy Policy.
        </label>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={loading} className="h-11 w-full rounded-xl bg-gradient-primary shadow-glow">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account…</> : "Create Account"}
        </Button>
        <div className="relative py-1 text-center"><span className="relative z-10 bg-background px-3 text-xs text-muted-foreground">or</span><span className="absolute left-0 top-1/2 h-px w-full bg-border" /></div>
        <GoogleButton label="Sign up with Google" onClick={() => { signup(form.name || "Sarah Mitchell", form.email || "sarah@nurture.health"); navigate({ to: "/onboarding" }); }} />
        <p className="pt-2 text-center text-sm text-muted-foreground">Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Login</Link></p>
      </form>
    </AuthLayout>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon: typeof User; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative mt-1.5">
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        {children}
      </div>
    </div>
  );
}
