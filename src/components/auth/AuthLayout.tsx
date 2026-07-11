import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { ShieldCheck, HeartPulse, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-illustration.png";

export function AuthLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left visual */}
      <div className="relative hidden overflow-hidden bg-gradient-primary lg:block">
        <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
          <Logo textClassName="text-primary-foreground" />
          <div>
            <img src={heroImg} alt="" width={1024} height={1024} className="mx-auto w-72 animate-float" />
            <h2 className="mt-6 font-display text-3xl font-extrabold leading-tight">Care that understands every stage of motherhood.</h2>
            <div className="mt-8 space-y-3 text-sm text-primary-foreground/90">
              <p className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> Personalized AI guidance, 24/7</p>
              <p className="flex items-center gap-2"><HeartPulse className="h-4 w-4" /> Track pregnancy & postpartum recovery</p>
              <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Private, encrypted & evidence-based</p>
            </div>
          </div>
          <p className="text-xs text-primary-foreground/70">© {new Date().getFullYear()} Nurture Health</p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center bg-background px-5 py-10">
        <div className="w-full max-w-md animate-fade-up">
          <div className="mb-8 lg:hidden"><Logo /></div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">{title}</h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function GoogleButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card py-2.5 text-sm font-medium transition hover:bg-accent">
      <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"/></svg>
      {label}
    </button>
  );
}

export { Link };
