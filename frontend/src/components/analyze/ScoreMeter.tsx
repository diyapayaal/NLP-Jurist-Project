interface Props {
  score: number;
  label?: string;
}

export function ScoreMeter({ score, label = "Alignment Score" }: Props) {
  const clamped = Math.max(0, Math.min(100, score));
  const r = 56;
  const c = 2 * Math.PI * r;
  const offset = c - (clamped / 100) * c;

  const tone =
    clamped >= 85 ? "var(--success)" : clamped >= 65 ? "var(--cyan)" : clamped >= 45 ? "var(--warning)" : "var(--destructive)";

  return (
    <div className="glass rounded-2xl p-6 flex items-center gap-6">
      <div className="relative size-36 shrink-0">
        <svg viewBox="0 0 140 140" className="size-full -rotate-90">
          <defs>
            <linearGradient id="meterGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.7 0.2 240)" />
              <stop offset="100%" stopColor="oklch(0.85 0.18 200)" />
            </linearGradient>
          </defs>
          <circle cx="70" cy="70" r={r} stroke="oklch(0.3 0.04 265)" strokeWidth="10" fill="none" />
          <circle
            cx="70"
            cy="70"
            r={r}
            stroke="url(#meterGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease-out", filter: `drop-shadow(0 0 8px ${tone})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-foreground">{clamped}</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">/ 100</div>
        </div>
      </div>
      <div>
        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
        <div className="text-xl font-semibold text-foreground mt-1">
          {clamped >= 85 ? "Strong alignment" : clamped >= 65 ? "Moderate gaps" : clamped >= 45 ? "Significant gaps" : "Critical exposure"}
        </div>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs">
          Composite score across requirement coverage, control effectiveness, and remediation latency.
        </p>
      </div>
    </div>
  );
}
