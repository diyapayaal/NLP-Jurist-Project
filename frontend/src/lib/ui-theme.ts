/**
 * Premium UI utilities for glassmorphism, animations, and gradients
 */

export const glassmorphismStyles = {
  glass: "backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl",
  glassHover: "hover:bg-white/15 hover:border-white/30 transition-all duration-300",
  glassCard: "backdrop-blur-md bg-gradient-to-br from-white/15 to-white/5 border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all",
};

export const gradients = {
  primary: "bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500",
  accent: "bg-gradient-to-r from-cyan-400 to-blue-600",
  warning: "bg-gradient-to-r from-orange-400 to-red-500",
  success: "bg-gradient-to-r from-emerald-400 to-green-500",
  animated: "animate-gradient bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-[length:200%_200%]",
};

export const glow = {
  primary: "glow-primary drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]",
  accent: "drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]",
  danger: "drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]",
};

export const animations = {
  float: "animate-[float_3s_ease-in-out_infinite]",
  pulse: "animate-pulse",
  shimmer: "animate-[shimmer_2s_infinite]",
  fadeIn: "animate-in fade-in",
  slideUp: "animate-in slide-in-from-bottom-4",
};

export const backgrounds = {
  dark: "bg-slate-950",
  darkGradient: "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950",
  darkCard: "bg-slate-900/40",
};
