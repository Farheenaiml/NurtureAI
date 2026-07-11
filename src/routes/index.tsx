import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bot, Mic, Baby, Apple, Stethoscope, Brain, HeartPulse, BookOpen, Siren, Activity,
  ArrowRight, Play, Star, Check, X, Menu, ShieldCheck, Search, Sparkles,
  UserPlus, MessageCircleHeart, ClipboardList, LineChart, Facebook, Instagram, Twitter, Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
} from "@/components/ui/carousel";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/Logo";
import { testimonials, faqs } from "@/services/mockData";
import heroImg from "@/assets/hero-illustration.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nurture — Empowering Every Mother with Intelligent AI Care" },
      { name: "description", content: "AI-powered pregnancy and postpartum companion helping mothers with health guidance, nutrition, emotional wellness, symptom tracking and evidence-based support." },
    ],
  }),
  component: Landing,
});

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how" },
  { label: "About", href: "#about" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const features = [
  { icon: Bot, title: "AI Health Assistant", desc: "Ask anything about pregnancy and get warm, evidence-based answers instantly." },
  { icon: Mic, title: "Voice AI", desc: "Talk naturally with Nurture — hands-free support whenever you need it." },
  { icon: HeartPulse, title: "Pregnancy Tracking", desc: "Follow every week with baby size, milestones and body changes." },
  { icon: Baby, title: "Baby Development", desc: "Week-by-week growth insights and beautiful development timelines." },
  { icon: Apple, title: "Nutrition Planner", desc: "Personalized meals, nutrient goals and hydration tracking." },
  { icon: Stethoscope, title: "Symptom Checker", desc: "Understand symptoms with severity guidance and when to call your doctor." },
  { icon: Brain, title: "Mental Wellness", desc: "Mood tracking, affirmations and calming exercises for emotional health." },
  { icon: HeartPulse, title: "Postpartum Support", desc: "Recovery timeline, feeding trackers and mood check-ins after birth." },
  { icon: BookOpen, title: "Medical Knowledge", desc: "Trusted, referenced guidance drawn from evidence-based sources." },
  { icon: Siren, title: "Emergency Guidance", desc: "Clear steps and quick contacts when every second matters." },
];

const steps = [
  { icon: UserPlus, title: "Create your profile", desc: "Set up your account in under a minute." },
  { icon: MessageCircleHeart, title: "Tell Nurture about your pregnancy", desc: "Share your journey and preferences." },
  { icon: Sparkles, title: "Receive personalized AI guidance", desc: "Get warm, tailored support daily." },
  { icon: ClipboardList, title: "Track your health every day", desc: "Log symptoms, nutrition and mood easily." },
  { icon: LineChart, title: "Continue support after childbirth", desc: "Seamless postpartum recovery care." },
];

const stats = [
  { value: "10K+", label: "Mothers Supported" },
  { value: "95%", label: "Satisfaction" },
  { value: "24/7", label: "AI Companion" },
  { value: "100%", label: "Evidence-based" },
];

const comparison = [
  { label: "Trustworthy, referenced answers", trad: false, nurture: true },
  { label: "Personalized to your week & history", trad: false, nurture: true },
  { label: "Available instantly, 24/7", trad: false, nurture: true },
  { label: "Warm, emotionally supportive tone", trad: false, nurture: true },
  { label: "Tracks your health over time", trad: false, nurture: true },
  { label: "Endless conflicting search results", trad: true, nurture: false },
];

function Landing() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-primary">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            <Button asChild variant="ghost" className="rounded-xl">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="rounded-xl bg-gradient-primary shadow-glow">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden"><Menu /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="mt-8 flex flex-col gap-1">
                {navLinks.map((l) => (
                  <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent">
                    {l.label}
                  </a>
                ))}
                <Button asChild variant="outline" className="mt-4 rounded-xl"><Link to="/login">Login</Link></Button>
                <Button asChild className="rounded-xl bg-gradient-primary"><Link to="/signup">Get Started</Link></Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-accent blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-40 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-primary shadow-soft">
              <Sparkles className="h-3.5 w-3.5" /> Intelligent AI maternal care
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Empowering Every Mother with <span className="text-gradient">Intelligent AI Care</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              AI-powered pregnancy and postpartum companion helping mothers with health guidance, nutrition, emotional wellness, symptom tracking and evidence-based support.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-xl bg-gradient-primary px-6 shadow-glow">
                <Link to="/signup">Start Your Journey <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl px-6">
                <Play className="mr-1 h-4 w-4" /> Watch Demo
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-success" /> Private, encrypted & evidence-based
            </div>
          </div>
          <div className="relative animate-fade-up">
            <div className="absolute inset-0 -z-10 mx-auto h-[85%] w-[85%] rounded-[3rem] bg-gradient-soft" />
            <div className="relative rounded-[2.5rem] border border-border/60 bg-card/70 p-4 shadow-card backdrop-blur">
              <img src={heroImg} alt="Pregnant woman interacting with an AI assistant" width={1024} height={1024} className="mx-auto w-full max-w-md animate-float" />
            </div>
            <Card className="absolute -bottom-4 left-2 flex items-center gap-3 rounded-2xl p-3 shadow-card sm:left-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-primary"><Baby className="h-5 w-5" /></span>
              <div><p className="text-xs text-muted-foreground">This week</p><p className="text-sm font-bold">Week 26 · Cucumber 🥒</p></div>
            </Card>
            <Card className="absolute -right-1 top-6 flex items-center gap-2 rounded-2xl p-3 shadow-card sm:right-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-success/10 text-success"><Check className="h-4 w-4" /></span>
              <p className="text-sm font-semibold">Nutrition on track</p>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto max-w-7xl px-5 pb-14">
          <div className="grid grid-cols-2 gap-4 rounded-3xl border border-border/60 bg-card p-6 shadow-soft md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-3xl font-extrabold text-gradient">{s.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-5 py-20">
        <SectionHeading eyebrow="Features" title="Everything a mother needs, in one calm place" subtitle="Thoughtfully designed tools that support your body and mind through every stage." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {features.map((f) => (
            <Card key={f.title} className="card-hover group rounded-2xl border-border/60 p-6">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-primary transition group-hover:bg-gradient-primary group-hover:text-primary-foreground">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-base font-bold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-muted/40 py-20">
        <div className="mx-auto max-w-4xl px-5">
          <SectionHeading eyebrow="How It Works" title="How Nurture works" subtitle="Five simple steps to personalized maternal care." />
          <div className="relative mt-12">
            <div className="absolute left-6 top-0 h-full w-px bg-border md:left-1/2" />
            <div className="space-y-8">
              {steps.map((s, i) => (
                <div key={s.title} className={`relative flex items-start gap-5 md:w-1/2 ${i % 2 ? "md:ml-auto md:pl-10" : "md:pr-10 md:text-right md:flex-row-reverse"}`}>
                  <span className="z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <Card className="flex-1 rounded-2xl border-border/60 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">Step {i + 1}</p>
                    <h3 className="mt-1 font-display font-bold">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why choose / comparison */}
      <section id="about" className="mx-auto max-w-5xl px-5 py-20">
        <SectionHeading eyebrow="Why Nurture" title="Traditional searching vs Nurture AI" subtitle="Stop guessing. Start receiving care that understands you." />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <Card className="rounded-3xl border-border/60 p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-muted text-muted-foreground"><Search className="h-5 w-5" /></span>
              <h3 className="font-display text-lg font-bold text-muted-foreground">Traditional Searching</h3>
            </div>
            <ul className="space-y-3">
              {comparison.map((c) => (
                <li key={c.label} className="flex items-start gap-3 text-sm">
                  {c.trad ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" /> : <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive/60" />}
                  <span className="text-muted-foreground">{c.label}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="relative overflow-hidden rounded-3xl border-primary/30 bg-gradient-soft p-7 shadow-card">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow"><HeartPulse className="h-5 w-5" /></span>
              <h3 className="font-display text-lg font-bold">Nurture AI</h3>
            </div>
            <ul className="space-y-3">
              {comparison.map((c) => (
                <li key={c.label} className="flex items-start gap-3 text-sm">
                  {c.nurture ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> : <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />}
                  <span className={c.nurture ? "font-medium" : "text-muted-foreground line-through"}>{c.label}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/40 py-20">
        <div className="mx-auto max-w-5xl px-5">
          <SectionHeading eyebrow="Testimonials" title="Loved by mothers everywhere" subtitle="Real stories from the Nurture community." />
          <Carousel className="mt-12" opts={{ align: "start", loop: true }}>
            <CarouselContent>
              {testimonials.map((t) => (
                <CarouselItem key={t.name} className="md:basis-1/2">
                  <Card className="h-full rounded-2xl border-border/60 p-6">
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-warning text-warning" />)}
                    </div>
                    <p className="mt-4 text-sm leading-relaxed">"{t.text}"</p>
                    <div className="mt-5 flex items-center gap-3">
                      <Avatar><AvatarFallback className="bg-gradient-primary text-primary-foreground">{t.name.slice(0, 2)}</AvatarFallback></Avatar>
                      <div><p className="text-sm font-semibold">{t.name}</p><p className="text-xs text-muted-foreground">{t.role}</p></div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-5 py-20">
        <SectionHeading eyebrow="FAQ" title="Questions, answered" subtitle="Everything you need to know about Nurture." />
        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`f${i}`} className="rounded-2xl border border-border/60 bg-card px-5">
              <AccordionTrigger className="text-left font-medium hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section id="contact" className="mx-auto max-w-7xl px-5 pb-20">
        <Card className="relative overflow-hidden rounded-[2.5rem] bg-gradient-primary p-10 text-center text-primary-foreground shadow-glow sm:p-16">
          <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Begin your journey with Nurture today</h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">Join thousands of mothers receiving warm, intelligent care every day.</p>
          <Button asChild size="lg" variant="secondary" className="mt-8 rounded-xl bg-background px-8 text-primary hover:bg-background/90">
            <Link to="/signup">Start Your Journey <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">Empowering every mother with intelligent, evidence-based AI care through pregnancy and beyond.</p>
            <div className="mt-4 flex gap-2">
              {[Facebook, Instagram, Twitter, Linkedin].map((I, i) => (
                <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-xl border border-border text-muted-foreground transition hover:bg-accent hover:text-primary"><I className="h-4 w-4" /></a>
              ))}
            </div>
          </div>
          <FooterCol title="Quick Links" links={["Home", "Features", "How It Works", "About", "FAQ"]} />
          <FooterCol title="Company" links={["About Us", "Careers", "Privacy Policy", "Terms of Service"]} />
          <div>
            <h4 className="font-display text-sm font-bold">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>hello@nurture.health</li>
              <li>+1 (415) 555-0100</li>
              <li>San Francisco, CA</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Nurture Health. All rights reserved. Not a substitute for professional medical care.
        </div>
      </footer>
    </div>
  );
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</span>
      <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-3 text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="font-display text-sm font-bold">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {links.map((l) => <li key={l}><a href="#" className="transition hover:text-primary">{l}</a></li>)}
      </ul>
    </div>
  );
}
