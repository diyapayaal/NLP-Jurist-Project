import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { TrendingUp, AlertTriangle } from "lucide-react";

// Chart Props
interface ChartProps {
  className?: string;
}

interface TrendPoint { date: string; score: number; gaps?: number }

export function ComplianceTrendChart({ data, className = "" }: { data?: TrendPoint[]; className?: string }) {
  const fallback = [
    { date: "Jan", score: 65, gaps: 12 },
    { date: "Feb", score: 68, gaps: 11 },
    { date: "Mar", score: 72, gaps: 9 },
    { date: "Apr", score: 70, gaps: 10 },
    { date: "May", score: 75, gaps: 7 },
  ];
  const chartData = data && data.length ? data : fallback;

  return (
    <div className={`glass rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Compliance Trend</h3>
          <p className="text-xs text-muted-foreground">Last alignment trend</p>
        </div>
        <TrendingUp className="size-5 text-accent" />
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              background: "rgba(17, 25, 40, 0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px"
            }}
            labelStyle={{ color: "#f8fafc" }}
          />
          <Area type="monotone" dataKey="score" stroke="#4f46e5" fillOpacity={1} fill="url(#colorScore)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DepartmentImpactChart({ departments, className = "" }: { departments?: string[]; className?: string }) {
  const colors = ["#4f46e5", "#06b6d4", "#67e8f9", "#818cf8", "#06b6d4", "#ef4444"];
  const data = (departments && departments.length)
    ? departments.map((d, i) => ({ name: d, value: Math.round(100 / departments.length), fill: colors[i % colors.length] }))
    : [];

  return (
    <div className={`glass rounded-2xl p-6 ${className}`}>
      <h3 className="text-base font-semibold text-foreground mb-4">Department Impact</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "rgba(17, 25, 40, 0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px"
            }}
            labelStyle={{ color: "#f8fafc" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RiskDistributionChart({ gaps, className = "" }: { gaps?: Array<{ severity: string }>; className?: string }) {
  const counts = { critical: 0, high: 0, medium: 0, low: 0 } as Record<string, number>;
  (gaps || []).forEach((g) => {
    const s = (g as any).severity || "low";
    counts[s] = (counts[s] || 0) + 1;
  });
  const data = [
    { name: "Critical", value: counts.critical || 0, fill: "#ef4444" },
    { name: "High", value: counts.high || 0, fill: "#f59e0b" },
    { name: "Medium", value: counts.medium || 0, fill: "#eab308" },
    { name: "Low", value: counts.low || 0, fill: "#22c55e" },
  ];

  return (
    <div className={`glass rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Risk Distribution</h3>
          <p className="text-xs text-muted-foreground">Gap severity breakdown</p>
        </div>
        <AlertTriangle className="size-5 text-warning" />
      </div>
      <div className="space-y-3">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="size-3 rounded-full" style={{ backgroundColor: item.fill }} />
              <span className="text-sm text-muted-foreground">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 rounded-full bg-muted flex-1 w-20 overflow-hidden">
                <div
                  className="h-full transition-all"
                  style={{ width: `${item.value ? Math.min(100, item.value * 10) : 0}%`, backgroundColor: item.fill }}
                />
              </div>
              <span className="text-sm font-medium text-foreground w-8 text-right">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RemediationTimelineChart({ data, className = "" }: { data?: Array<{ week: string; completed: number; planned: number }>; className?: string }) {
  const fallback = [
    { week: "W1", completed: 3, planned: 5 },
    { week: "W2", completed: 5, planned: 4 },
    { week: "W3", completed: 4, planned: 6 },
    { week: "W4", completed: 6, planned: 3 },
  ];
  const chartData = data && data.length ? data : fallback;

  return (
    <div className={`glass rounded-2xl p-6 ${className}`}>
      <h3 className="text-base font-semibold text-foreground mb-4">Remediation Timeline</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="week" stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              background: "rgba(17, 25, 40, 0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px"
            }}
            labelStyle={{ color: "#f8fafc" }}
          />
          <Legend />
          <Line type="monotone" dataKey="completed" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e" }} />
          <Line type="monotone" dataKey="planned" stroke="#4f46e5" strokeWidth={2} dot={{ fill: "#4f46e5" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
