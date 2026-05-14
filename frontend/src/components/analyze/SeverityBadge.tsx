import type { Severity } from "@/lib/mock-data";

const map: Record<Severity, { label: string; cls: string; dot: string }> = {
  low: { label: "Low", cls: "bg-success/10 text-success border-success/30", dot: "bg-success" },
  medium: { label: "Medium", cls: "bg-warning/10 text-warning border-warning/30", dot: "bg-warning" },
  high: { label: "High", cls: "bg-accent/10 text-accent border-accent/30", dot: "bg-accent" },
  critical: { label: "Critical", cls: "bg-destructive/10 text-destructive border-destructive/40", dot: "bg-destructive" },
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  const m = map[severity];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium uppercase tracking-wider ${m.cls}`}
    >
      <span className={`size-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}
