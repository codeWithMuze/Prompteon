
import React from 'react';
import { PromptMetrics } from '../types';

interface MetricsCardProps {
  metrics: PromptMetrics;
}

const HealthWidget: React.FC<{
  label: string;
  value: number;
  desc: string;
}> = ({ label, value, desc }) => (
  <div className="glass-card group relative overflow-hidden rounded-[24px] p-6 hover:border-white/10">
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

    <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
          <div className="h-0.5 w-6 bg-zinc-800 rounded-full group-hover:bg-tactical-500 group-hover:w-10 transition-all duration-500 delay-75" />
        </div>
        <div className="flex items-baseline space-x-1">
          <span className="text-3xl font-black text-zinc-100 tabular-nums leading-none tracking-tight group-hover:text-glow transition-all">{value}</span>
          <span className="text-[10px] font-bold text-zinc-600 uppercase">%</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-1.5 w-full bg-zinc-950/50 rounded-full overflow-hidden shadow-inner ring-1 ring-white/5">
          <div
            className="h-full bg-gradient-to-r from-zinc-400 to-zinc-200 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.2)]"
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

export const MetricsCard: React.FC<MetricsCardProps> = ({ metrics }) => {
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
      </div>
    </div>
  );
};
