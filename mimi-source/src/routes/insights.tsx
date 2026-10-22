import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";
import { AppShell, StatusBar } from "@/components/mimi/AppShell";
import { Card, Sparkline, StatusPill } from "@/components/mimi/ui";
import { insights } from "@/lib/mimi-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Insights — mimi." },
      { name: "description", content: "Your patterns: contextual health insights with sources, confidence and personal baselines." },
      { property: "og:title", content: "Insights — mimi." },
      { property: "og:description", content: "Your patterns, in context." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InsightsPage,
});

const cats = ["All", "Cardiovascular", "Sleep", "Labs", "Preventive"];
const toneBg: Record<string, string> = { pink: "bg-thermal", cobalt: "bg-cobalt-fade", coral: "bg-aurora", lime: "bg-lime" };

function InsightsPage() {
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<string | null>(null);
  const list = insights.filter((i) => cat === "All" || i.category === cat);
  const sel = insights.find((i) => i.id === open);

  return (
    <AppShell>
      <StatusBar />
      <h1 className="display px-5 pt-6 text-[56px]">Your<br />patterns.</h1>
      <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto px-5">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={cn("shrink-0 rounded-full px-4 py-2 text-sm font-bold", c === cat ? "bg-primary text-primary-foreground" : "bg-card")}>{c}</button>
        ))}
      </div>

      <div className="mt-5 space-y-3 px-5">
        {list.map((i, idx) => (
          <button key={i.id} onClick={() => setOpen(i.id)} className="block w-full text-left">
            {idx === 0 ? (
              <div className={cn("relative overflow-hidden rounded-[32px] p-5 text-ink grain", toneBg[i.tone])}>
                <span className="tech">{i.category}</span>
                <p className="display mt-16 text-[34px]">{i.title}</p>
                <Sparkline data={i.series} className="mt-4 h-12 w-full" stroke="var(--ink)" />
              </div>
            ) : (
              <Card>
                <div className="flex items-center justify-between"><span className="tech text-muted-foreground">{i.category}</span><StatusPill status={i.status} /></div>
                <p className="headline mt-3 text-xl">{i.title}</p>
                {i.series.length > 0 && <Sparkline data={i.series} className="mt-3 h-8 w-full" stroke="var(--cobalt)" />}
              </Card>
            )}
          </button>
        ))}
      </div>

      {sel && (
        <div className="absolute inset-0 z-40 flex items-end bg-ink/40 backdrop-blur-sm" onClick={() => setOpen(null)}>
          <div role="dialog" aria-label={sel.title} onClick={(e) => e.stopPropagation()} className="w-full animate-rise rounded-t-[36px] bg-background p-6 pb-10">
            <div className="flex items-start justify-between">
              <StatusPill status={sel.status} />
              <button aria-label="Close" onClick={() => setOpen(null)} className="flex h-9 w-9 items-center justify-center rounded-full bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <h2 className="display mt-4 text-[32px]">{sel.title}</h2>
            {sel.series.length > 0 && (
              <div className="relative mt-5 rounded-2xl bg-card p-4">
                <div className="absolute inset-x-4 top-[45%] h-6 rounded bg-aqua/20" aria-hidden />
                <Sparkline data={sel.series} className="relative h-20 w-full" stroke="var(--pink)" />
                <p className="tech mt-2 text-muted-foreground">Band = your personal baseline</p>
              </div>
            )}
            <p className="mt-4 text-[15px]">{sel.body}</p>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div><dt className="tech text-muted-foreground">Confidence</dt><dd className="font-bold">{sel.confidence}</dd></div>
              <div><dt className="tech text-muted-foreground">Sources</dt><dd className="font-bold">{sel.sources.join(", ")}</dd></div>
            </dl>
            <p className="mt-5 text-xs text-muted-foreground">mimi provides information, not diagnosis. Consider discussing changes with your clinician.</p>
          </div>
        </div>
      )}
    </AppShell>
  );
}
