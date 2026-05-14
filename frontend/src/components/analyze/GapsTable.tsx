import { useMemo, useState } from "react";
import type { AnalysisResponse, Severity } from "@/lib/mock-data";
import { SeverityBadge } from "./SeverityBadge";
import { ArrowUpDown } from "lucide-react";

const order: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };

export function GapsTable({ gaps }: { gaps: AnalysisResponse["gap_analysis"]["gaps"] }) {
  const [sortKey, setSortKey] = useState<"severity" | "policy" | "description">("severity");
  const [dir, setDir] = useState<1 | -1>(1);

  const sorted = useMemo(() => {
    const arr = [...gaps];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "severity") cmp = order[a.severity] - order[b.severity];
      if (sortKey === "policy") cmp = a.affected_policy.localeCompare(b.affected_policy);
      if (sortKey === "description") cmp = a.description.localeCompare(b.description);
      return cmp * dir;
    });
    return arr;
  }, [gaps, sortKey, dir]);

  const toggle = (k: typeof sortKey) => {
    if (sortKey === k) setDir((d) => (d === 1 ? -1 : 1));
    else {
      setSortKey(k);
      setDir(1);
    }
  };

  const Header = ({ k, label }: { k: typeof sortKey; label: string }) => (
    <button
      onClick={() => toggle(k)}
      className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
    >
      {label}
      <ArrowUpDown className="size-3" />
    </button>
  );

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Compliance Gaps</h3>
          <p className="text-xs text-muted-foreground">{gaps.length} gaps identified across policies</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40 bg-muted/20">
              <th className="text-left px-6 py-3"><Header k="description" label="Gap Description" /></th>
              <th className="text-left px-6 py-3"><Header k="severity" label="Severity" /></th>
              <th className="text-left px-6 py-3"><Header k="policy" label="Affected Policy" /></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((g, i) => (
              <tr key={i} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4 text-foreground max-w-md">{g.description}</td>
                <td className="px-6 py-4"><SeverityBadge severity={g.severity} /></td>
                <td className="px-6 py-4">
                  <code className="text-xs px-2 py-1 rounded-md bg-input/50 text-accent border border-border">
                    {g.affected_policy}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
