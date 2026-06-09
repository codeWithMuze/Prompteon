
import React, { useState } from 'react';
import { PromptMetrics } from '../types';

interface MetricsCardProps {
  metrics: PromptMetrics;
}

// ── Tooltip content per metric ───────────────────────────────────────
const METRIC_TIPS: Record<string, string> = {
  Clarity: "Be specific about what you want. Bad: 'write code'. Good: 'write a Python function that sorts a list by date'.",
  Details: "Add examples, constraints, or desired format to guide the AI precisely.",
  Background: "Explain who you are or why you need this — context helps the AI tailor its response.",
  Focus: "Limit your prompt to one clear objective. Multi-goal prompts confuse AI.",
  Structure: "Use numbered steps or bullet points if needed. Organized prompts get organized answers.",
  Boundaries: "Tell the AI what NOT to do or what to avoid. Constraints sharpen output.",
};

function scoreBadgeColor(value: number): string {
  if (value <= 30) return 'bg-rose-500/15 text-rose-400 border-rose-500/25';
  if (value <= 60) return 'bg-amber-500/15 text-amber-400 border-amber-500/25';
  return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25';
}

function scoreBarColor(value: number): string {
  if (value <= 30) return 'from-rose-500 to-rose-400';
  if (value <= 60) return 'from-amber-500 to-amber-400';
  return 'from-emerald-400 to-emerald-300';
}

const HealthWidget: React.FC<{
  label: string;
  value: number;
  desc: string;
}> = ({ label, value, desc }) => {
  const [showTip, setShowTip] = useState(false);

  return (
    <div className="glass-card group relative overflow-hidden rounded-[24px] p-6 hover:border-white/10">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1.5 flex items-center gap-2">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
            {/* Tooltip trigger */}
            <div className="relative">
              <button
                onMouseEnter={() => setShowTip(true)}
                onMouseLeave={() => setShowTip(false)}
                onClick={() => setShowTip(!showTip)}
                className="w-4 h-4 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-[8px] text-zinc-600 hover:text-zinc-400 transition-colors flex-shrink-0"
              >?</button>
              {showTip && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-56 p-3 bg-zinc-900 border border-white/10 rounded-lg shadow-xl text-[11px] text-zinc-400 leading-relaxed z-50 pointer-events-none">
                  {METRIC_TIPS[label] || desc}
                </div>
              )}
            </div>
          </div>
          {/* Colored badge */}
          <span className={`px-2.5 py-1 rounded-md text-xs font-black border ${scoreBadgeColor(value)}`}>
            {value}%
          </span>
        </div>

        <div className="space-y-4">
          <div className="h-1.5 w-full bg-zinc-950/50 rounded-full overflow-hidden shadow-inner ring-1 ring-white/5">
            <div
              className={`h-full bg-gradient-to-r ${scoreBarColor(value)} rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${value}%` }}
            />
          </div>

          <p className="text-[13px] text-zinc-400 font-medium leading-relaxed group-hover:text-zinc-300 transition-colors min-h-[40px]">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
};

export const MetricsCard: React.FC<MetricsCardProps> = ({ metrics }) => {
  // Compute weakest areas
  const metricEntries: { label: string; value: number }[] = [
    { label: 'Clarity', value: metrics.clarity },
    { label: 'Details', value: metrics.specificity },
    { label: 'Background', value: metrics.context },
    { label: 'Focus', value: metrics.goalOrientation },
    { label: 'Structure', value: metrics.structure },
    { label: 'Boundaries', value: metrics.constraints },
  ];
  const weakest = metricEntries
    .filter(m => m.value < 60)
    .sort((a, b) => a.value - b.value)
    .slice(0, 3)
    .map(m => m.label);

  return (
    <div className="relative pt-24 md:pt-32 border-t border-white/10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-radial-gradient from-zinc-800/20 via-transparent to-transparent -z-10 pointer-events-none" />

      <div className="w-full space-y-12 md:space-y-16">
        <div className="text-center space-y-8 relative max-w-3xl mx-auto">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-tactical-500/10 blur-[120px] rounded-full opacity-0 animate-reveal" />

          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center space-x-3 px-4 py-1.5 bg-zinc-900/40 border border-white/5 rounded-full mb-2 backdrop-blur-md shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)] animate-pulse" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">System Diagnostics</span>
            </div>

            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-100 tracking-tight leading-none text-glow">
              Prompt Health
            </h3>

            <p className="text-zinc-400 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
              A clear breakdown of how your instructions are built. High percentages mean your prompt is ready for results.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <HealthWidget
            label="Clarity"
            value={metrics.clarity}
            desc="Is it obvious what you want the AI to do?"
          />
          <HealthWidget
            label="Details"
            value={metrics.specificity}
            desc="Did you give specific examples to help the AI?"
          />
          <HealthWidget
            label="Background"
            value={metrics.context}
            desc="The extra info that explains the 'why' behind the task."
          />
          <HealthWidget
            label="Focus"
            value={metrics.goalOrientation}
            desc="Does the prompt stay strictly on one objective?"
          />
          <HealthWidget
            label="Structure"
            value={metrics.structure}
            desc="How logically your text is organized and formatted."
          />
          <HealthWidget
            label="Boundaries"
            value={metrics.constraints}
            desc="The limits on what the AI should and shouldn't do."
          />
        </div>

        {/* Weakest areas summary */}
        {weakest.length > 0 && (
          <div className="text-center pt-4">
            <p className="text-[12px] font-bold text-zinc-500 tracking-wide">
              Your weakest areas: <span className="text-amber-400">{weakest.join(', ')}</span>.
              <span className="text-zinc-400 ml-1">The optimized prompt fixes all of these. ✦</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
