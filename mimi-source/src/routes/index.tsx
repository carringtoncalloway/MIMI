import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Apple, Check, ChevronLeft, LoaderCircle, Mail } from "lucide-react";
import { PhoneFrame } from "@/components/mimi/AppShell";
import { Crosshair } from "@/components/mimi/ui";
import { LivingTwin } from "@/components/mimi/LivingTwin";
import { cn } from "@/lib/utils";
import twinLight from "@/assets/twin-light.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "mimi. — Your personal health digital twin" },
      { name: "description", content: "Meet mimi. Your health, finally connected — wearables, records, labs and cycle in one living digital twin." },
      { property: "og:title", content: "mimi. — Your personal health digital twin" },
      { property: "og:description", content: "Your health. Your data. Your digital twin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Onboarding,
});

const interests = [
  "Overall health", "Medical records", "Better sleep", "Cardiovascular", "Fitness & recovery",
  "Women's health", "Lab results", "Symptoms", "Ongoing conditions", "Prevention",
];
const ecosystem = ["Apple Health", "Apple Watch", "Oura", "MyChart", "Labcorp"];

type SigninMethod = "apple" | "google" | "email";

function VerifyingCard({ label }: { label: string }) {
  return (
    <div className="mx-auto mb-8 flex items-center gap-3 rounded-2xl bg-card px-5 py-4 shadow-float">
      <LoaderCircle className="h-5 w-5 animate-spin text-muted-foreground" />
      <span className="text-sm font-bold">{label}</span>
    </div>
  );
}

function WelcomeCard() {
  return (
    <div className="mx-auto mb-8 flex items-center gap-3 rounded-2xl bg-card px-5 py-4 shadow-float animate-rise">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-aqua text-ink"><Check className="h-5 w-5" strokeWidth={3} /></span>
      <span className="text-sm font-bold">Welcome, Rosie.</span>
    </div>
  );
}

function SigninScreen({ method, onDone, onBack }: { method: SigninMethod; onDone: () => void; onBack: () => void }) {
  const [stage, setStage] = useState<"ready" | "verifying" | "welcome">("ready");
  const [email, setEmail] = useState("rosie@hello.mimi");
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState("");

  // email: the verification code types itself in, one digit at a time
  useEffect(() => {
    if (method === "email" && sent && code.length < 6) {
      const t = setTimeout(() => setCode("472913".slice(0, code.length + 1)), 280);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [method, sent, code]);

  useEffect(() => {
    if (stage === "verifying") {
      const t = setTimeout(() => setStage("welcome"), 1300);
      return () => clearTimeout(t);
    }
    if (stage === "welcome") {
      const t = setTimeout(onDone, 1100);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [stage, onDone]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-6 pt-5">
        <button onClick={onBack} className="flex items-center gap-0.5 text-sm font-bold text-muted-foreground">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <span className="text-2xl font-black tracking-tighter">mimi.</span>
      </div>

      {method === "apple" && (
        <>
          <div className="flex flex-1 flex-col items-center justify-center px-6">
            <div className="relative flex h-28 w-28 items-center justify-center rounded-[36px] bg-card shadow-float grain">
              <Apple className="h-12 w-12 text-foreground" fill="currentColor" />
            </div>
            <h1 className="display mt-8 text-center text-[44px]">Sign in<br />with Apple.</h1>
            <p className="mt-3 max-w-[280px] text-center text-[15px] text-muted-foreground">
              mimi creates your private space from your Apple ID. Nothing is shared without you.
            </p>
          </div>
          <div className="px-6 pb-8">
            {stage === "ready" && (
              <>
                <button onClick={() => setStage("verifying")} className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary font-bold text-primary-foreground">
                  <Apple className="h-5 w-5" /> Continue with Face ID
                </button>
                <p className="tech mt-4 text-center opacity-50">demo · no real account is created</p>
              </>
            )}
            {stage === "verifying" && <VerifyingCard label="Confirming with Face ID…" />}
            {stage === "welcome" && <WelcomeCard />}
          </div>
        </>
      )}

      {method === "google" && (
        <>
          <div className="flex flex-1 flex-col justify-center px-6">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-card text-3xl font-black shadow-float">G</span>
            <h1 className="display mt-6 text-center text-[44px]">Choose an<br />account.</h1>
            <p className="mt-3 text-center text-[15px] text-muted-foreground">to continue to <span className="font-bold text-foreground">mimi.</span></p>
            <button
              onClick={() => setStage("verifying")}
              disabled={stage !== "ready"}
              className="mt-8 flex w-full items-center justify-between rounded-2xl border border-border bg-card px-4 py-4 text-left shadow-card disabled:opacity-70"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-thermal text-sm font-black">R</span>
                <span>
                  <span className="block text-sm font-bold">Rosie</span>
                  <span className="block text-xs text-muted-foreground">rosie@hello.mimi</span>
                </span>
              </span>
              <span className="tech opacity-50">continue</span>
            </button>
          </div>
          <div className="px-6 pb-8">
            {stage === "verifying" && <VerifyingCard label="Signing you in…" />}
            {stage === "welcome" && <WelcomeCard />}
            {stage === "ready" && (
              <p className="tech text-center opacity-50">demo · no real account is created</p>
            )}
          </div>
        </>
      )}

      {method === "email" && (
        <>
          <div className="flex flex-1 flex-col px-6 pt-8">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card shadow-float"><Mail className="h-6 w-6" /></span>
            <h1 className="display mt-6 text-[44px]">
              {sent ? "Check your inbox." : "What's your email?"}
            </h1>
            <p className="mt-3 text-[15px] text-muted-foreground">
              {sent ? "We sent a 6-digit code to rosie@hello.mimi." : "We'll send you a one-time code. No passwords, ever."}
            </p>

            {!sent && (
              <label className="mt-8 block">
                <span className="tech opacity-60">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 h-14 w-full rounded-2xl border border-border bg-card px-5 text-[16px] font-semibold outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
            )}

            {sent && (
              <div className="mt-8">
                <div className="flex gap-2" aria-label="Verification code">
                  {"472913".split("").map((d, i) => (
                    <span key={i} className={cn("flex h-14 flex-1 items-center justify-center rounded-2xl border border-border bg-card text-xl font-bold tabular shadow-card", i < code.length && "border-primary")}>
                      {i < code.length ? d : ""}
                    </span>
                  ))}
                </div>
                <p className="tech mt-3 text-center opacity-50">demo · code fills itself in</p>
              </div>
            )}
          </div>
          <div className="px-6 pb-8">
            {!sent && (
              <button onClick={() => setSent(true)} disabled={!email.includes("@")} className="flex h-14 w-full items-center justify-center rounded-full bg-primary font-bold text-primary-foreground disabled:opacity-40">
                Send code
              </button>
            )}
            {sent && code.length < 6 && <VerifyingCard label="Waiting for code…" />}
            {sent && code.length === 6 && stage === "ready" && (
              <button onClick={() => setStage("verifying")} className="flex h-14 w-full items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                Verify code
              </button>
            )}
            {stage === "verifying" && <VerifyingCard label="Verifying code…" />}
            {stage === "welcome" && <WelcomeCard />}
          </div>
        </>
      )}
    </div>
  );
}

function Onboarding() {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string[]>(["Women's health", "Better sleep"]);
  const [linked, setLinked] = useState<string[]>([]);
  const [signin, setSignin] = useState<SigninMethod | null>(null);
  const nav = useNavigate();
  const next = () => (step < 6 ? setStep(step + 1) : nav({ to: "/home" }));
  const dark = signin ? signin !== "google" : step === 0 || step === 3 || step === 5;

  return (
    <PhoneFrame dark={dark}>
      {signin ? (
        <SigninScreen
          method={signin}
          onDone={() => {
            setSignin(null);
            setStep(4);
          }}
          onBack={() => setSignin(null)}
        />
      ) : (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-6 pt-5">
            <span className="text-2xl font-black tracking-tighter">mimi.</span>
            <div className="flex gap-1" aria-label={`Step ${step + 1} of 7`}>
              {Array.from({ length: 7 }).map((_, i) => (
                <span key={i} className={cn("h-1 rounded-full transition-all", i === step ? "w-6 bg-foreground" : "w-2 bg-foreground/25")} />
              ))}
            </div>
            <Link to="/home" className="tech opacity-60 hover:opacity-100">Skip</Link>
          </div>

          <div key={step} className="relative flex flex-1 flex-col animate-rise overflow-hidden">
            {step === 0 && (
              <>
                <div className="relative flex flex-1 items-center justify-center">
                  <LivingTwin className="w-[105%] max-w-none" />
                  <Crosshair className="inset-10 text-foreground" />
                  <span className="tech absolute right-6 top-6 text-right opacity-60">data becomes<br />understanding</span>
                </div>
                <div className="px-6 pb-4">
                  <h1 className="display text-[64px]">Meet<br />mimi.</h1>
                  <p className="mt-3 text-lg text-muted-foreground">Your health, finally connected.</p>
                </div>
              </>
            )}

            {step === 1 && (
              <div className="flex flex-1 flex-col px-6 pt-10">
                <h1 className="display text-[58px]">All of you.<br /><span className="text-muted-foreground">In one place.</span></h1>
                <div className="relative my-6 flex-1 overflow-hidden rounded-[32px] bg-cobalt-fade grain">
                  <img src={twinLight} alt="" className="absolute inset-0 h-full w-full object-cover mix-blend-screen animate-drift" />
                  {["Clinical history", "Wearables", "Labs", "Cycle"].map((t, i) => (
                    <span key={t} className="tech absolute rounded-full bg-card/80 px-2.5 py-1 text-foreground backdrop-blur" style={{ left: `${10 + (i % 2) * 48}%`, top: `${12 + i * 20}%` }}>● {t}</span>
                  ))}
                </div>
                <p className="pb-2 text-[15px] text-muted-foreground">mimi brings together your records, personal data and wearables into one private, evolving picture.</p>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-1 flex-col px-6 pt-10">
                <h1 className="display text-[54px]">Your health isn't a snapshot.</h1>
                <div className="relative mt-8 flex-1">
                  <div className="absolute left-0 right-0 top-1/2 h-px bg-foreground/30" />
                  {[2019, 2021, 2023, 2025, 2026].map((y, i) => (
                    <div key={y} className="absolute top-1/2 -translate-y-1/2" style={{ left: `${i * 22}%` }}>
                      <div className="rounded-full bg-thermal grain" style={{ width: 18 + i * 12, height: 18 + i * 12, opacity: 0.4 + i * 0.15 }} />
                      <span className="tech mt-2 block tabular">{y}</span>
                    </div>
                  ))}
                </div>
                <p className="pb-2 text-[15px] text-muted-foreground">Every visit, night of sleep and lab result adds to a longitudinal picture that's uniquely yours.</p>
              </div>
            )}

            {step === 3 && (
              <div className="relative flex flex-1 flex-col">
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
                  <span className="h-64 w-64 rounded-full bg-cobalt/25 blur-3xl animate-twin-breathe" />
                  <span className="absolute h-44 w-44 rounded-full bg-pink/20 blur-3xl animate-twin-breathe" />
                </div>
                <div className="relative flex flex-1 items-center justify-center">
                  <span className="display animate-twin-breathe text-[68px] leading-none">mimi<span className="text-primary">.</span></span>
                </div>
                <div className="relative px-6 pb-2">
                  <h1 className="display text-[52px]">Create your space.</h1>
                  <p className="mt-3 font-medium">Encrypted. Private by default. Yours to control.</p>
                </div>
                <div className="relative mt-auto space-y-3 px-6 pb-8">
                  <div className="rounded-full bg-flow p-[2px] shadow-float">
                    <button onClick={() => setSignin("apple")} className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary font-bold text-primary-foreground"><Apple className="h-5 w-5" /> Continue with Apple</button>
                  </div>
                  <div className="rounded-full bg-flow p-[2px]">
                    <button onClick={() => setSignin("google")} className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-background font-bold"><span className="text-lg font-black">G</span> Continue with Google</button>
                  </div>
                  <button onClick={() => setSignin("email")} className="h-12 w-full rounded-full font-bold text-muted-foreground">Continue with email</button>
                  <p className="text-center text-xs text-muted-foreground">By continuing you agree to the <u>Terms</u> and <u>Privacy Policy</u>.</p>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-1 flex-col px-6 pt-10">
                <h1 className="display text-[48px]">What matters to you?</h1>
                <p className="mt-3 text-muted-foreground">Choose as many as you like. We'll shape mimi around them.</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {interests.map((t) => {
                    const on = picked.includes(t);
                    return (
                      <button key={t} aria-pressed={on} onClick={() => setPicked(on ? picked.filter((p) => p !== t) : [...picked, t])}
                        className={cn("rounded-full border px-4 py-2.5 text-sm font-semibold transition-all", on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card")}>
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="flex flex-1 flex-col px-6 pt-10">
                <h1 className="display text-[48px]">Connect your ecosystem.</h1>
                <p className="mt-3 text-muted-foreground">You choose exactly what each source shares.</p>
                <div className="mt-6 space-y-2">
                  {ecosystem.map((s) => {
                    const on = linked.includes(s);
                    return (
                      <button key={s} onClick={() => setLinked(on ? linked.filter((p) => p !== s) : [...linked, s])}
                        className="flex w-full items-center justify-between rounded-2xl bg-card px-4 py-4 text-left">
                        <span className="font-bold">{s}</span>
                        <span className={cn("flex h-7 items-center gap-1 rounded-full px-3 text-xs font-bold", on ? "bg-aqua text-ink" : "bg-muted")}>
                          {on ? <><Check className="h-3 w-3" /> Connected</> : "Connect"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="flex flex-1 flex-col px-6 pt-10">
                <div className="relative flex-1">
                  <LivingTwin variant="light" className="absolute inset-0 m-auto h-full" />
                  <Crosshair className="inset-8 text-foreground" />
                </div>
                <h1 className="display text-[56px]">A little<br />more you.</h1>
                <p className="mt-3 pb-2 text-muted-foreground">Your digital twin is ready. It grows as you do.</p>
              </div>
            )}
          </div>

          {step !== 3 && (
            <div className="px-6 pb-8 pt-4">
              <button onClick={next} className="flex h-14 w-full items-center justify-between rounded-full bg-primary pl-6 pr-2 font-bold text-primary-foreground">
                {step === 0 ? "Get started" : step === 6 ? "Enter mimi" : "Continue"}
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground text-primary"><ArrowRight className="h-5 w-5" /></span>
              </button>
            </div>
          )}
        </div>
      )}
    </PhoneFrame>
  );
}
