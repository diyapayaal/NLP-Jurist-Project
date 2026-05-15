import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Check, AlertCircle, CheckCircle2, Target } from "lucide-react";

interface ScoreMeterProps {
  score: number;
  target?: number;
  className?: string;
}

export function ScoreMeterAdvanced({ score, target = 80, className = "" }: ScoreMeterProps) {
  const scoreStatus = useMemo(() => {
    if (score >= target) return { label: "Excellent", color: "#22c55e", textColor: "text-emerald-400" };
    if (score >= target - 10) return { label: "Good", color: "#eab308", textColor: "text-yellow-400" };
    if (score >= target - 20) return { label: "Fair", color: "#f59e0b", textColor: "text-orange-400" };
    return { label: "Action Required", color: "#ef4444", textColor: "text-red-400" };
  }, [score, target]);

  const chartData = [
    { name: "Score", value: score, fill: scoreStatus.color },
    { name: "Gap", value: 100 - score, fill: "rgba(255,255,255,0.05)" },
  ];

  const gap = 100 - score;

  return (
    <div className={`glass rounded-2xl p-8 ${className}`}>
      <div className="flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-base font-semibold text-foreground mb-2">Alignment Score</h3>
          <p className="text-xs text-muted-foreground">Compliance with current regulation</p>
        </div>

        {/* Gauge Chart */}
        <div className="relative size-48">
          <ResponsiveContainer width={192} height={192}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
                startAngle={180}
                endAngle={0}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-5xl font-bold ${scoreStatus.textColor}`}>
              {Math.round(score)}
            </div>
            <div className="text-xs text-muted-foreground">%</div>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`mt-8 px-4 py-2 rounded-full glass border ${
          score >= target
            ? "border-emerald-500/30 bg-emerald-500/10"
            : score >= target - 10
            ? "border-yellow-500/30 bg-yellow-500/10"
            : score >= target - 20
            ? "border-orange-500/30 bg-orange-500/10"
            : "border-red-500/30 bg-red-500/10"
        }`}>
          <div className="flex items-center gap-2">
            {score >= target ? (
              <CheckCircle2 className={`size-4 ${scoreStatus.textColor}`} />
            ) : (
              <AlertCircle className={`size-4 ${scoreStatus.textColor}`} />
            )}
            <span className={`text-sm font-medium ${scoreStatus.textColor}`}>
              {scoreStatus.label}
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="mt-8 w-full grid grid-cols-3 gap-3">
          <div className="glass-strong rounded-lg p-3 text-center">
            <Check className="size-5 text-emerald-400 mx-auto mb-1" />
            <div className="text-xl font-bold text-foreground">{score}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Aligned</div>
          </div>
          <div className="glass-strong rounded-lg p-3 text-center">
            <AlertCircle className="size-5 text-red-400 mx-auto mb-1" />
            <div className="text-xl font-bold text-foreground">{gap}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Gaps</div>
          </div>
          <div className="glass-strong rounded-lg p-3 text-center">
            <Target className="size-5 text-accent mx-auto mb-1" />
            <div className="text-xl font-bold text-foreground">{target}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Target</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Keep a canonical `ScoreMeter` export for existing imports that expect this name.
export const ScoreMeter = ScoreMeterAdvanced;
