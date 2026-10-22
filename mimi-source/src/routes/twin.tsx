import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, StatusBar } from "@/components/mimi/AppShell";
import { Card, Crosshair, Sparkline, StatusPill } from "@/components/mimi/ui";
import { twinDimensions, twinSystems, twinLayers } from "@/lib/mimi-data";
import { cn } from "@/lib/utils";
import { LivingTwin } from "@/components/mimi/LivingTwin";

export const Route = createFileRoute("/twin")({
  head: () => ({
    meta: [
      { title: "My Digital Twin — mimi." },
      { name: "description", content: "An interactive, living view of you across sleep, heart, recovery, activity and hormonal health." },
      { property: "og:title", content: "My Digital Twin — mimi." },
      { property: "og:description", content: "A living view of you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TwinPage,
});

const views = ["Overview", "Systems", "Layers"];
const ranges = ["Now", "30D", "1Y", "All"];

function TwinPage() {
  const [view, setView] = useState(0);
  const [range, setRange] = useState(1);
  const [focus, setFocus] = useState<string | null>(null);
  const [openLayer, setOpenLayer] = useState<number | null>(0);
  const f = twinDimensions.find((d) => d.key === focus);
  return (
    <AppShell dark>
      <StatusBar />
      <header className="flex items-end justify-between px-5 pt-6">
        <h1 className="display text-[44px]">My digital<br />twin.</h1>
        {view === 0 && (
          <div className="flex rounded-full bg-muted p-1">
            {ranges.map((r, i) => (
              <button key={r} onClick={() => setRange(i)} className={cn("tech rounded-full px-2.5 py-1.5", i === range && "bg-primary text-primary-foreground")}>{r}</button>
            ))}
          </div>
        )}
      </header>

      {view === 0 && (
        <>
          <div className="relative mx-auto mt-4 aspect-square w-full">
            <LivingTwin className={cn("absolute inset-0 transition-transform duration-1000", range === 3 && "scale-110")} />
            <Crosshair className="inset-6 text-foreground" />
            <svg className="absolute inset-0 h-full w-full" aria-hidden>
              {twinDimensions.map((d) => <line key={d.key} x1="50%" y1="50%" x2={`${d.x}%`} y2={`${d.y}%`} stroke="currentColor" strokeOpacity={0.25} strokeDasharray="2 3" />)}
            </svg>
            {twinDimensions.map((d) => (
              <button key={d.key} onClick={() => setFocus(d.key === focus ? null : d.key)}
                className={cn("absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1.5 text-left backdrop-blur transition-all", focus === d.key ? "bg-primary text-primary-foreground" : "bg-card/50")}
                style={{ left: `${d.x}%`, top: `${d.y}%` }}>
                <span className="block text-[12px] font-bold leading-none">{d.key}</span>
                <span className="tech tabular opacity-70">{d.value}</span>
              </button>
            ))}
          </div>

          <div className="mx-5 rounded-3xl bg-card p-5">
            {f ? (
              <>
                <p className="tech text-muted-foreground">Focus · {f.key}</p>
                <p className="headline mt-2 text-2xl">{f.key} is {f.value} vs. your 30-day baseline.</p>
                <p className="mt-2 text-sm text-muted-foreground">Calculated from 1,284 measurements across 3 sources. Confidence: moderate. Not a diagnosis.</p>
              </>
            ) : (
              <>
                <p className="tech text-muted-foreground">Model transparency</p>
                <p className="headline mt-2 text-2xl">Tap a dimension to explore what shapes your twin.</p>
                <p className="mt-2 text-sm text-muted-foreground">Shape and colour reflect data coverage — never risk.</p>
              </>
            )}
          </div>
        </>
      )}

      {view === 1 && (
        <div className="mt-4 space-y-3 px-5">
          <p className="tech px-1 text-muted-foreground">Five body systems, read against your own baselines.</p>
          {twinSystems.map((s) => (
            <Card key={s.key}>
              <div className="flex items-start justify-between gap-3">
                <p className="text-[15px] font-bold">{s.key}</p>
                <Sparkline data={s.series} className="h-8 w-20 shrink-0 opacity-80" />
              </div>
              <p className="headline mt-1.5 text-lg leading-snug">{s.headline}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.detail}</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <StatusPill status={s.status} />
                <span className="tech text-muted-foreground">{s.sources.join(" · ")}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {view === 2 && (
        <div className="mt-4 space-y-3 px-5">
          <p className="tech px-1 text-muted-foreground">Your twin is built in layers — each one adds context to the last. Tap a layer to see what feeds it.</p>
          {twinLayers.map((l, i) => (
            <div key={l.key} className="overflow-hidden rounded-3xl bg-card shadow-card">
              <button onClick={() => setOpenLayer(openLayer === i ? null : i)} className="flex w-full items-center justify-between gap-3 p-5 text-left">
                <div>
                  <p className="text-[15px] font-bold">{l.key}</p>
                  <p className="tech mt-0.5 text-muted-foreground">{l.subtitle}</p>
                </div>
                <span className="tech text-muted-foreground">{openLayer === i ? "hide" : `${l.items.length} facts`}</span>
              </button>
              {openLayer === i && (
                <div className="border-t border-border px-5 py-4">
                  <p className="text-sm text-muted-foreground">{l.detail}</p>
                  <ul className="mt-3 space-y-2">
                    {l.items.map((it) => (
                      <li key={it} className="flex items-center gap-2.5 text-sm"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{it}</li>
                    ))}
                  </ul>
                  <p className="tech mt-3 text-muted-foreground">{l.meta}</p>
                </div>
              )}
            </div>
          ))}
          <p className="px-1 pb-1 text-xs text-muted-foreground">Layers reflect data coverage and history — never risk. Not a diagnosis.</p>
        </div>
      )}

      <div className="mx-auto mt-5 flex w-max rounded-full bg-muted p-1">
        {views.map((v, i) => (
          <button key={v} onClick={() => setView(i)} className={cn("rounded-full px-4 py-2 text-sm font-bold", i === view && "bg-primary text-primary-foreground")}>{v}</button>
        ))}
      </div>
    </AppShell>
  );
}
