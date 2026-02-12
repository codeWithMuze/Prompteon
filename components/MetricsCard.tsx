
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
  <div className="group relative overflow-hidden bg-zinc-900/40 border border-white/10 p-8 rounded-[2rem] hover:bg-zinc-900/60 hover:border-white/20 transition-all duration-500 ring-1 ring-white/5">
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

    <div className="relative z-10 space-y-6">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{label}</span>
          <div className="h-1 w-8 bg-zinc-700 rounded-full group-hover:bg-zinc-100 group-hover:w-12 transition-all duration-500" />
        </div>
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-black text-zinc-100 tabular-nums leading-none">{value}</span>
          <span className="text-xs font-bold text-zinc-500 uppercase">%</span>
        </div>
      </div>

      <div className="h-2 w-full bg-zinc-950/70 rounded-full overflow-hidden p-[1px]">
        <div
          className="h-full bg-zinc-200 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          style={{ width: `${value}%` }}
        />
      </div>

      <p className="text-[14px] text-zinc-300 font-medium leading-relaxed group-hover:text-zinc-100 transition-colors">
        {desc}
      </p>
    </div>
  </div>
);

export const MetricsCard: React.FC<MetricsCardProps> = ({ metrics }) => {
  return (
    <div className="relative pt-24 md:pt-32 border-t border-white/10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-radial-gradient from-zinc-800/20 via-transparent to-transparent -z-10 pointer-events-none" />

      <div className="w-full space-y-12 md:space-y-16">
        <div className="text-center space-y-6 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-tactical-500/20 blur-[100px] rounded-full opacity-50 pointer-events-none" />
          <div className="relative inline-flex items-center space-x-3 px-4 py-1.5 bg-zinc-900/60 border border-white/10 rounded-full mb-2 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
            <span className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em]">Quality Audit</span>
          </div>
          <h3 className="text-3xl md:text-5xl font-black text-zinc-100 tracking-tight leading-none">
            Prompt Health
          </h3>
          <p className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            A clear breakdown of how your instructions are built. High percentages mean your prompt is ready for results.
          </p>
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
