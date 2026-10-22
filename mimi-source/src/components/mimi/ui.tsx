import { Info, MessageCircle, AlertTriangle, Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Status } from "@/lib/mimi-data";
import { statusLabel } from "@/lib/mimi-data";

export function Sparkline({
  data,
  className,
  bars = false,
  stroke = "currentColor",
}: {
  data: number[];
  className?: string;
  bars?: boolean;
  stroke?: string;
}) {
  if (!data.length) return null;
  const w = 120, h = 40;
  const min = Math.min(...data), max = Math.max(...data);
  const span = max - min || 1;
  const pts: [number, number][] = data.map((v, i) => [(i / (data.length - 1)) * w, h - 4 - ((v - min) / span) * (h - 8)]);
  if (bars) {
    const bw = w / data.length - 2;
    return (
      <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none" aria-hidden>
        {pts.map(([x, y], i) => (
          <rect key={i} x={i * (w / data.length)} y={y} width={bw} height={h - y} rx={1.5} fill={stroke} opacity={0.35 + (i / data.length) * 0.65} />
        ))}
      </svg>
    );
  }
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const [lx, ly] = pts[pts.length - 1]!;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none" aria-hidden>
      <path d={d} fill="none" stroke={stroke} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx={lx} cy={ly} r={2.6} fill={stroke} />
    </svg>
  );
}

const statusStyles: Record<Status, string> = {
  info: "text-status-info bg-status-info/10",
  discuss: "text-status-discuss bg-status-discuss/12",
  attention: "text-status-attention bg-status-attention/10",
  good: "text-status-good bg-status-good/10",
};
const statusIcon = { info: Info, discuss: MessageCircle, attention: AlertTriangle, good: Check };

export function StatusPill({ status }: { status: Status }) {
  const Icon = statusIcon[status];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold", statusStyles[status])}>
      <Icon className="h-3 w-3" strokeWidth={2.5} />
      {statusLabel[status]}
    </span>
  );
}

export function SectionHead({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-3 mt-8 flex items-end justify-between px-5">
      <h2 className="headline text-[22px]">{title}</h2>
      {action && <span className="text-sm font-medium text-muted-foreground">{action}</span>}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-3xl bg-card p-4 shadow-card", className)}>{children}</div>;
}

export function Crosshair({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute", className)} aria-hidden>
      <div className="absolute left-1/2 top-0 h-full w-px bg-current opacity-40" />
      <div className="absolute left-0 top-1/2 h-px w-full bg-current opacity-40" />
      <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-current opacity-60" />
    </div>
  );
}

export function CycleRing({ day, length, size = 180 }: { day: number; length: number; size?: number }) {
  const r = size / 2 - 10;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`Cycle day ${day} of ${length}`}>
      {Array.from({ length }).map((_, i) => {
        const a = (i / length) * Math.PI * 2 - Math.PI / 2;
        const x = size / 2 + Math.cos(a) * r, y = size / 2 + Math.sin(a) * r;
        const phase = i < 5 ? "var(--pink)" : i < 13 ? "var(--lilac)" : i < 16 ? "var(--coral)" : "var(--cobalt)";
        const active = i + 1 === day;
        return <circle key={i} cx={x} cy={y} r={active ? 7 : 3.4} fill={phase} opacity={i + 1 <= day ? 1 : 0.3} stroke={active ? "var(--ink)" : "none"} strokeWidth={2} />;
      })}
    </svg>
  );
}
