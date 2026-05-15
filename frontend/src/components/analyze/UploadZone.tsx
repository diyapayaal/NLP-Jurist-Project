import { useCallback, useRef, useState } from "react";
import { UploadCloud, FileCheck2, Loader2, X, Zap, Shield, Gauge } from "lucide-react";

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
    
    // Simulated upload progress with more natural curve
    let p = 0;
    const id = setInterval(() => {
      const increment = Math.random() * 25 + 5;
      p = Math.min(p + increment, 100);
      setProgress(p);
      
      if (p >= 100) {
        clearInterval(id);
        // Trigger analysis
        onAnalyze(f);
      }
    }, 300);
  }, [onAnalyze]);

  return (
    <div className="glass-strong rounded-2xl p-6">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Upload Regulation</h2>
          <p className="text-xs text-muted-foreground">Drop an RBI PDF to begin compliance analysis</p>
        </div>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">PDF · Max 25MB</span>
      </div>

      {/* Upload Area */}
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
          ${dragOver 
            ? "border-accent bg-accent/10 ring-glow shadow-lg" 
            : "border-border hover:border-primary/60 hover:bg-primary/5"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? undefined)}
          disabled={isAnalyzing}
        />
        
        <div className="flex flex-col items-center gap-3">
          <div className="mx-auto size-16 rounded-2xl bg-gradient-primary grid place-items-center glow-primary animate-float">
            <UploadCloud className="size-8 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm text-foreground font-medium">Drag & drop your PDF here</div>
            <div className="text-xs text-muted-foreground mt-1">or click to browse files</div>
          </div>
        </div>
      </div>

      {/* File Preview & Progress */}
      {file && (
        <div className="mt-4 glass-strong rounded-xl p-4 space-y-3 border border-accent/20">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-gradient-primary/30 grid place-items-center flex-shrink-0">
              <FileCheck2 className="size-5 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-medium text-foreground truncate">{file.name}</div>
                {!isAnalyzing && (
                  <button
                    onClick={() => {
                      setFile(null);
                      setProgress(0);
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="h-2 rounded-full bg-muted/40 overflow-hidden relative">
              <div
                className={`h-full ${
                  isAnalyzing 
                    ? "bg-gradient-to-r from-cyan-400 to-blue-500" 
                    : "bg-gradient-to-r from-violet-500 to-purple-500"
                } transition-all duration-200`}
                style={{ width: `${progress}%` }}
              />
              {progress < 100 && <div className="absolute inset-0 shimmer" />}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-muted-foreground">
                {progress < 100 ? `Uploading ${Math.round(progress)}%` : isAnalyzing ? "Analyzing..." : "Ready"}
              </span>
              {isAnalyzing && (
                <span className="text-[11px] text-accent flex items-center gap-1">
                  <Loader2 className="size-3 animate-spin" />
                  Processing
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Features Grid */}
      <div className="mt-6 grid grid-cols-3 gap-2">
        <div className="glass-strong rounded-lg p-3 text-center text-xs hover:shadow-md transition-shadow">
          <Zap className="size-4 text-accent mx-auto mb-1" />
          <div className="text-muted-foreground">Fast</div>
          <div className="text-[10px] text-muted-foreground/70">8-12 sec</div>
        </div>
        <div className="glass-strong rounded-lg p-3 text-center text-xs hover:shadow-md transition-shadow">
          <Shield className="size-4 text-emerald-400 mx-auto mb-1" />
          <div className="text-muted-foreground">Secure</div>
          <div className="text-[10px] text-muted-foreground/70">Encrypted</div>
        </div>
        <div className="glass-strong rounded-lg p-3 text-center text-xs hover:shadow-md transition-shadow">
          <Gauge className="size-4 text-blue-400 mx-auto mb-1" />
          <div className="text-muted-foreground">Accurate</div>
          <div className="text-[10px] text-muted-foreground/70">AI-Powered</div>
        </div>
      </div>
    </div>
  );
}
