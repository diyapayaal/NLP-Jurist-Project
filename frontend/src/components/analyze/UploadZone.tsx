import { useCallback, useRef, useState } from "react";
import { UploadCloud, FileCheck2, Loader2, X } from "lucide-react";

interface Props {
  onAnalyze: (file: File) => Promise<void> | void;
  isAnalyzing: boolean;
}

export function UploadZone({ onAnalyze, isAnalyzing }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File | undefined) => {
    if (!f) return;
    if (f.type !== "application/pdf") return;
    setFile(f);
    setProgress(0);
    // Simulated upload progress
    let p = 0;
    const id = setInterval(() => {
      p += Math.random() * 18 + 6;
      if (p >= 100) {
        p = 100;
        clearInterval(id);
      }
      setProgress(p);
    }, 180);
  }, []);

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Upload regulation</h2>
          <p className="text-xs text-muted-foreground">Drop an RBI circular or master direction PDF to begin</p>
        </div>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">PDF only · max 25MB</span>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all p-10 text-center
          ${dragOver ? "border-accent bg-accent/5 ring-glow" : "border-border hover:border-primary/60"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? undefined)}
        />
        <div className="mx-auto size-14 rounded-2xl bg-gradient-primary grid place-items-center glow-primary animate-float">
          <UploadCloud className="size-7 text-primary-foreground" />
        </div>
        <div className="mt-4 text-sm text-foreground font-medium">Drag & drop your PDF here</div>
        <div className="text-xs text-muted-foreground mt-1">or click to browse files</div>
      </div>

      {file && (
        <div className="mt-4 glass rounded-xl p-4 flex items-center gap-4">
          <div className="size-10 rounded-lg bg-accent/15 grid place-items-center">
            <FileCheck2 className="size-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-medium text-foreground truncate">{file.name}</div>
              <button
                onClick={() => {
                  setFile(null);
                  setProgress(0);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden relative">
              <div
                className="h-full bg-gradient-primary transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
              {progress < 100 && <div className="absolute inset-0 shimmer" />}
            </div>
            <div className="flex justify-between mt-1.5 text-[11px] text-muted-foreground">
              <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              <span>{progress < 100 ? `Uploading ${Math.round(progress)}%` : "Ready"}</span>
            </div>
          </div>
        </div>
      )}

      <button
        disabled={!file || progress < 100 || isAnalyzing}
        onClick={() => file && onAnalyze(file)}
        className="mt-5 w-full h-11 rounded-xl bg-gradient-primary text-primary-foreground font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:glow-primary flex items-center justify-center gap-2"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Analyzing with Jurist-LLM…
          </>
        ) : (
          "Run AI Analysis"
        )}
      </button>
    </div>
  );
}
