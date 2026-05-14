import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { mockReports } from "@/lib/mock-data";
import { Download, FileText, Calendar } from "lucide-react";

export const Route = createFileRoute("/reports")({
  component: Reports,
  head: () => ({
    meta: [
      { title: "Reports — NLP-Jurist" },
      { name: "description", content: "Download previously generated compliance analysis reports." },
    ],
  }),
});

function Reports() {
  return (
    <AppShell title="Reports">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockReports.map((r) => (
          <div key={r.id} className="glass rounded-2xl p-5 group hover:ring-glow transition-all">
            <div className="flex items-start justify-between">
              <div className="size-10 rounded-lg bg-gradient-primary/15 grid place-items-center">
                <FileText className="size-5 text-accent" />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{r.id}</span>
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground leading-snug">{r.title}</h3>
            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Calendar className="size-3" /> {r.date}</span>
              <span>·</span>
              <span>{r.size}</span>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Alignment</div>
                <div className="text-2xl font-bold text-gradient">{r.score}</div>
              </div>
              <button className="inline-flex items-center gap-2 px-3 h-9 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium hover:glow-primary transition">
                <Download className="size-4" /> Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
