import { cn } from "@/lib/utils";
import twinDark from "@/assets/twin-dark.jpg";
import twinLight from "@/assets/twin-light.jpg";

/**
 * The digital twin: a defined iridescent organism that breathes,
 * slowly morphs and shifts colour — alive, but still a clear form.
 */
export function LivingTwin({
  className,
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
  intensity?: number;
}) {
  const src = variant === "dark" ? twinDark : twinLight;
  const blend = variant === "dark" ? "mix-blend-screen" : "mix-blend-multiply";
  return (
    <div className={cn("relative aspect-square", className)} aria-hidden style={{ maskImage: "radial-gradient(closest-side, black 75%, transparent 100%)", WebkitMaskImage: "radial-gradient(closest-side, black 75%, transparent 100%)" }}>
      {/* soft aura */}
      <img src={src} alt="" className={cn("absolute inset-0 h-full w-full scale-110 rounded-full object-contain opacity-60 blur-2xl animate-twin-breathe", blend)} />
      {/* the organism */}
      <div className="absolute inset-0 animate-twin-breathe" style={{ maskImage: "radial-gradient(closest-side, black 82%, transparent 100%)", WebkitMaskImage: "radial-gradient(closest-side, black 82%, transparent 100%)" }}>
        <img src={src} alt="" className={cn("h-full w-full object-contain animate-twin-flow", blend)} />
      </div>
    </div>
  );
}
