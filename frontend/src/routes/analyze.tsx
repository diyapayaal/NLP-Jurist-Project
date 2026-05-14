import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { UploadZone } from "@/components/analyze/UploadZone";
import { AnalysisResults } from "@/components/analyze/AnalysisResults";
import { mockAnalysis, type AnalysisResponse } from "@/lib/mock-data";
import { Loader2, Sparkles } from "lucide-react";

export const Route = createFileRoute("/analyze")({
  component: Analyze,
  head: () => ({
    meta: [
      { title: "Analyze Regulation — NLP-Jurist" },
      { name: "description", content: "Upload an RBI regulation PDF and let AI surface compliance gaps." },
    ],
  }),
});

const API_URL = "http://127.0.0.1:8000/analyze";

function Analyze() {
  const [data, setData] = useState<AnalysisResponse | null>(mockAnalysis);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(API_URL, { method: "POST", body: fd });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const json = (await res.json()) as AnalysisResponse;
      setData(json);
    } catch (e: any) {
      setError(e?.message ?? "Failed to reach analysis backend. Showing sample results.");
      setData(mockAnalysis);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Analyze Regulation">
      <div className="grid lg:grid-cols-[420px_1fr] gap-6 items-start">
        <div className="space-y-4 lg:sticky lg:top-24">
          <UploadZone onAnalyze={handleAnalyze} isAnalyzing={loading} />
          {error && (
            <div className="glass rounded-xl p-4 text-xs text-warning border border-warning/30">{error}</div>
          )}
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="size-3.5 text-accent" /> How it works
            </div>
            <ol className="mt-3 space-y-2 text-sm text-foreground list-decimal list-inside">
              <li>PDF parsed by Jurist-LLM</li>
              <li>Cross-checked against your policy library</li>
              <li>Gaps & remediation surfaced</li>
            </ol>
          </div>
        </div>

        <div className="min-w-0">
          {loading ? (
            <div className="glass rounded-2xl p-16 flex flex-col items-center justify-center gap-4">
              <Loader2 className="size-10 text-accent animate-spin" />
              <div className="text-sm text-foreground">Running deep compliance analysis…</div>
              <div className="text-xs text-muted-foreground">This usually takes 8–12 seconds</div>
            </div>
          ) : data ? (
            <AnalysisResults data={data} />
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
