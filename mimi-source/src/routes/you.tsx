import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { AppShell, StatusBar } from "@/components/mimi/AppShell";
import { Card, SectionHead } from "@/components/mimi/ui";
import { sources, user } from "@/lib/mimi-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/you")({
  head: () => ({
    meta: [
      { title: "You — mimi." },
      { name: "description", content: "Your profile, connected sources, women's health settings and privacy controls." },
      { property: "og:title", content: "You — mimi." },
      { property: "og:description", content: "You own your data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: YouPage,
});

const swatch: Record<string, string> = { pink: "bg-pink", ink: "bg-ink", coral: "bg-coral", cobalt: "bg-cobalt", aqua: "bg-aqua", lilac: "bg-lilac" };

function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={onChange} className={cn("relative h-7 w-12 rounded-full transition-colors", on ? "bg-cobalt" : "bg-secondary")}>
      <span className={cn("absolute top-1 h-5 w-5 rounded-full bg-card transition-all", on ? "left-6" : "left-1")} />
    </button>
  );
}

function YouPage() {
  const [state, setState] = useState(() => Object.fromEntries(sources.map((s) => [s.name, s.on])));
  const [prefs, setPrefs] = useState({ cycle: true, research: false, signals: true });
  return (
    <AppShell>
      <StatusBar />
      <div className="px-5 pt-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-thermal text-2xl font-black text-ink grain">{user.name[0]}</div>
        <h1 className="display mt-4 text-[48px]">{user.name}.</h1>
        <p className="text-muted-foreground">{user.age} · member since 2026</p>
      </div>

      <SectionHead title="Connected ecosystem" action={<span>{Object.values(state).filter(Boolean).length} of {sources.length}</span>} />
      <div className="mx-5 divide-y divide-border rounded-3xl bg-card shadow-card">
        {sources.map((s) => (
          <div key={s.name} className="flex items-center gap-3 p-4">
            <span className={cn("h-9 w-9 shrink-0 rounded-xl", swatch[s.color])} />
            <div className="min-w-0 flex-1">
              <p className="font-bold">{s.name}</p>
              <p className="truncate text-xs text-muted-foreground">{s.detail} · {state[s.name] ? `synced ${s.synced}` : "not connected"}</p>
            </div>
            <Toggle label={s.name} on={!!state[s.name]} onChange={() => setState({ ...state, [s.name]: !state[s.name] })} />
          </div>
        ))}
      </div>

      <SectionHead title="Preferences" />
      <div className="mx-5 divide-y divide-border rounded-3xl bg-card shadow-card">
        {([["cycle", "Cycle & hormonal tracking"], ["signals", "Health signal notifications"], ["research", "Contribute to research (anonymised)"]] as const).map(([k, l]) => (
          <div key={k} className="flex items-center justify-between p-4">
            <span className="font-semibold">{l}</span>
            <Toggle label={l} on={prefs[k]} onChange={() => setPrefs({ ...prefs, [k]: !prefs[k] })} />
          </div>
        ))}
      </div>

      <Card className="mx-5 mt-6 bg-ink text-porcelain">
        <ShieldCheck className="h-6 w-6 text-aqua" />
        <p className="headline mt-3 text-xl">You own your data.</p>
        <p className="mt-1 text-sm opacity-70">End-to-end encrypted. Export or delete everything at any time.</p>
        <div className="mt-4 flex gap-2">
          <button className="rounded-full bg-porcelain px-4 py-2 text-sm font-bold text-ink">Export</button>
          <button className="rounded-full border border-porcelain/30 px-4 py-2 text-sm font-bold">Delete data</button>
        </div>
      </Card>
    </AppShell>
  );
}
