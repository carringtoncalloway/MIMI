import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Sparkles, LineChart, FolderHeart, User } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/twin", label: "Twin", icon: Sparkles },
  { to: "/insights", label: "Insights", icon: LineChart },
  { to: "/records", label: "Records", icon: FolderHeart },
  { to: "/you", label: "You", icon: User },
] as const;

export function PhoneFrame({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className="flex min-h-screen items-center justify-center sm:py-8">
      <div
        className={cn(
          "relative h-[100dvh] w-full overflow-hidden sm:h-[844px] sm:w-[390px] sm:rounded-[54px] sm:border-[10px] sm:border-ink sm:shadow-float",
          dark ? "dark bg-background text-foreground" : "bg-background text-foreground",
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function AppShell({ children, dark = false, hideAsk = false }: { children: ReactNode; dark?: boolean; hideAsk?: boolean }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <PhoneFrame dark={dark}>
      <div className="no-scrollbar h-full overflow-y-auto pb-36">{children}</div>

      {!hideAsk && (
        <Link
          to="/ask"
          aria-label="Ask MIMI"
          className="absolute bottom-[92px] right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-thermal text-ink shadow-float grain transition-transform active:scale-95"
        >
          <span className="absolute inset-0 rounded-full bg-pink/40 animate-pulse-ring" />
          <span className="relative text-[11px] font-black tracking-tight">ask</span>
        </Link>
      )}

      <nav
        aria-label="Primary"
        className="absolute inset-x-0 bottom-5 z-20 mx-auto flex w-max items-center gap-1 rounded-full border border-border bg-card/85 p-1.5 shadow-float backdrop-blur-xl"
      >
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = path === to;
          return (
            <Link
              key={to}
              to={to}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-11 items-center gap-1.5 rounded-full px-3.5 text-[12px] font-bold transition-all",
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
              {active && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>
    </PhoneFrame>
  );
}

export function StatusBar() {
  return (
    <div className="flex items-center justify-between px-7 pt-3.5 text-[15px] font-semibold">
      <span className="tabular">9:41</span>
      <span className="tech opacity-60">demo · synthetic data</span>
    </div>
  );
}
