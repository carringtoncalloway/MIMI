import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Bell } from "lucide-react";
import { AppShell, StatusBar } from "@/components/mimi/AppShell";
import { Card, CycleRing, SectionHead, Sparkline, StatusPill, Crosshair } from "@/components/mimi/ui";
import { insights, metrics, user } from "@/lib/mimi-data";
import { LivingTwin } from "@/components/mimi/LivingTwin";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Home — mimi." },
      { name: "description", content: "Your health, in perspective: today's signals, sleep, heart and cycle at a glance." },
      { property: "og:title", content: "Home — mimi." },
      { property: "og:description", content: "Your health, in perspective." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const signal = insights[0]!;
  return (
    <AppShell>
      <StatusBar />
      <header className="flex items-start justify-between px-5 pt-6">
        <div>
          <span className="tech text-muted-foreground">Thu · 22 Oct</span>
          <h1 className="display mt-2 text-[44px]">Good<br />morning, {user.name}.</h1>
        </div>
        <button aria-label="Notifications" className="mt-1 flex h-11 w-11 items-center justify-center rounded-full bg-card shadow-card"><Bell className="h-5 w-5" /></button>
      </header>

      <Link to="/twin" className="relative mx-5 mt-6 block h-[300px] overflow-hidden rounded-[32px] bg-ink text-porcelain grain">
        <LivingTwin className="absolute -right-12 -top-10 w-[110%]" />
        <Crosshair className="inset-6 text-porcelain" />
        <span className="tech absolute left-5 top-5 opacity-70">twin · v.214</span>
        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
          <div>
            <p className="text-sm opacity-70">Your digital twin</p>
            <p className="headline text-2xl">Is in sync.</p>
          </div>
          <span className="display text-[56px] tabular">92%</span>
        </div>
      </Link>

      <SectionHead title="Today at a glance" />
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-5 pb-1">
        {metrics.map((m, i) => (
          <Card key={m.key} className="w-[150px] shrink-0">
            <p className="tech text-muted-foreground">{m.label}</p>
            <p className="headline mt-3 text-[32px] tabular">{m.value}<span className="ml-1 text-sm font-semibold text-muted-foreground">{m.unit}</span></p>
            <Sparkline data={m.series} bars={i === 2} className="mt-2 h-9 w-full" stroke={["var(--pink)", "var(--cobalt)", "var(--lilac)", "var(--coral)"][i] ?? "var(--ink)"} />
            <p className="tech mt-2 text-muted-foreground">{m.delta} · {m.source}</p>
          </Card>
        ))}
      </div>

      <SectionHead title="Health signal" action={<Link to="/insights">All</Link>} />
      <Link to="/insights" className="mx-5 block">
        <Card>
          <StatusPill status={signal.status} />
          <p className="headline mt-3 text-[22px]">{signal.title}</p>
          <p className="mt-2 text-sm text-muted-foreground">{signal.body}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="tech text-muted-foreground">{signal.sources.join(" · ")}</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </Card>
      </Link>

      <SectionHead title="Women's health" />
      <div className="mx-5 grid grid-cols-[1fr_auto] items-center gap-2 rounded-[32px] bg-card p-5 shadow-card">
        <div>
          <p className="tech text-muted-foreground">Cycle</p>
          <p className="display mt-2 text-[48px] tabular">Day {user.cycleDay}</p>
          <p className="mt-1 text-sm text-muted-foreground">Luteal phase · period in ~11 days</p>
        </div>
        <CycleRing day={user.cycleDay} length={user.cycleLength} size={120} />
      </div>

      <SectionHead title="My health" />
      <div className="mx-5 grid grid-cols-2 gap-3">
        <Link to="/records" className="rounded-3xl bg-lime p-4 text-ink"><p className="tech">Records</p><p className="headline mt-6 text-xl">3 meds<br />5 sources</p></Link>
        <Link to="/records" className="rounded-3xl bg-cobalt p-4 text-porcelain"><p className="tech opacity-80">Latest labs</p><p className="headline mt-6 text-xl">Oct 03<br />1 trend</p></Link>
      </div>
    </AppShell>
  );
}
