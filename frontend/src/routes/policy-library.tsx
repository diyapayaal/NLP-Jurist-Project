import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Library, BookOpen } from "lucide-react";

export const Route = createFileRoute("/policy-library")({
  component: PolicyLibrary,
  head: () => ({
    meta: [
      { title: "Policy Library — NLP-Jurist" },
      { name: "description", content: "Internal policies cross-referenced against RBI regulations." },
    ],
  }),
});

const policies = [
  { code: "POL-KYC-014", title: "Customer Identification & PEP screening", domain: "KYC", updated: "2026-04-22" },
  { code: "POL-CDD-007", title: "Beneficial Ownership Identification", domain: "AML", updated: "2026-03-11" },
  { code: "POL-AML-022", title: "Adverse Media Monitoring", domain: "AML", updated: "2026-02-08" },
  { code: "POL-GOV-003", title: "Board MIS & Governance Reporting", domain: "Governance", updated: "2026-01-30" },
  { code: "POL-CYB-019", title: "Cybersecurity Incident Response", domain: "IT Risk", updated: "2026-04-04" },
  { code: "POL-LND-011", title: "Digital Lending Disclosures", domain: "Lending", updated: "2026-03-19" },
];

function PolicyLibrary() {
  return (
    <AppShell title="Policy Library">
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <Library className="size-5 text-accent" />
          <div>
            <h2 className="text-base font-semibold text-foreground">Internal Policies</h2>
            <p className="text-xs text-muted-foreground">{policies.length} policies indexed by Jurist-LLM</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {policies.map((p) => (
            <div key={p.code} className="glass rounded-xl p-4 hover:ring-glow transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <code className="text-[11px] px-2 py-0.5 rounded bg-input/40 text-accent border border-border">{p.code}</code>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{p.domain}</span>
              </div>
              <div className="mt-3 flex items-start gap-2">
                <BookOpen className="size-4 text-muted-foreground mt-0.5" />
                <div className="text-sm font-medium text-foreground leading-snug">{p.title}</div>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">Updated {p.updated}</div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
