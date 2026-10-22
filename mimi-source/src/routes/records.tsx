import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, StatusBar } from "@/components/mimi/AppShell";
import { Card, StatusPill } from "@/components/mimi/ui";
import { labs, meds, timeline } from "@/lib/mimi-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/records")({
  head: () => ({
    meta: [
      { title: "Records — mimi." },
      { name: "description", content: "Your personal health wallet: timeline, lab results, biomarkers and medications." },
      { property: "og:title", content: "Records — mimi." },
      { property: "og:description", content: "Your health story, in one wallet." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RecordsPage,
});

const tabs = ["Timeline", "Labs", "Medications"];
const dot: Record<string, string> = { signal: "bg-pink", visit: "bg-cobalt", lab: "bg-lime", med: "bg-coral", symptom: "bg-lilac" };

function RecordsPage() {
  const [tab, setTab] = useState(0);
  return (
    <AppShell>
      <StatusBar />
      <h1 className="display px-5 pt-6 text-[56px]">Health<br />story.</h1>
      <div className="mx-5 mt-5 flex rounded-full bg-secondary p-1">
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} className={cn("flex-1 rounded-full py-2.5 text-sm font-bold", i === tab && "bg-primary text-primary-foreground")}>{t}</button>
        ))}
      </div>

      {tab === 0 && (
        <ol className="relative mx-5 mt-6 border-l border-foreground/20 pl-6">
          {timeline.map((e) => (
            <li key={e.title} className="relative mb-6">
              <span className={cn("absolute -left-[31px] top-1 h-3 w-3 rounded-full ring-4 ring-background", dot[e.kind])} />
              <p className="tech text-muted-foreground">{e.date}</p>
              <p className="headline mt-1 text-lg">{e.title}</p>
              <p className="text-sm text-muted-foreground">{e.meta}</p>
            </li>
          ))}
        </ol>
      )}

      {tab === 1 && (
        <div className="mt-5 space-y-3 px-5">
          {labs.map((l) => (
            <Card key={l.name}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold">{l.name}</p>
                  <p className="headline mt-1 text-[34px] tabular">{l.value}<span className="ml-1 text-sm text-muted-foreground">{l.unit}</span></p>
                </div>
                <StatusPill status={l.status} />
              </div>
              <div className="relative mt-3 h-2 rounded-full bg-secondary">
                <div className="absolute inset-y-0 left-[10%] right-[25%] rounded-full bg-aqua/40" />
                <span className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-ink" style={{ left: `${l.pos * 100}%` }} />
              </div>
              <p className="tech mt-2 text-muted-foreground">Ref. range {l.range} · trend {l.trend} · Labcorp Oct 03</p>
            </Card>
          ))}
        </div>
      )}

      {tab === 2 && (
        <div className="mt-5 space-y-3 px-5">
          {meds.map((m) => (
            <Card key={m.name} className="flex items-center justify-between">
              <div><p className="headline text-lg">{m.name}</p><p className="text-sm text-muted-foreground">{m.dose}</p></div>
              <span className="tech text-muted-foreground">since {m.since}</span>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
