
import React, { useState, useMemo } from 'react';
import { AnalysisResult } from '../types';
import { MetricsCard } from './MetricsCard';

interface ResultsDashboardProps {
  result: AnalysisResult;
  originalPrompt?: string;
  originalScore?: number;
}

// ── Simple word-level diff ───────────────────────────────────────────
function computeDiff(original: string, improved: string): { type: 'same' | 'add' | 'remove'; text: string }[] {
  const origWords = original.split(/(\s+)/);
  const impWords = improved.split(/(\s+)/);
  const result: { type: 'same' | 'add' | 'remove'; text: string }[] = [];
  const origSet = new Set(origWords.filter(w => w.trim()));
  const impSet = new Set(impWords.filter(w => w.trim()));

  // Mark removed words
  origWords.forEach(w => {
    if (w.trim() && !impSet.has(w)) {
      result.push({ type: 'remove', text: w });
    }
  });

  // Mark added / same words
  impWords.forEach(w => {
    if (!w.trim()) {
      result.push({ type: 'same', text: w });
    } else if (!origSet.has(w)) {
      result.push({ type: 'add', text: w });
    } else {
      result.push({ type: 'same', text: w });
    }
  });

  return result;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  result,
  originalPrompt = '',
  originalScore = 0,
}) => {
  const [copied, setCopied] = useState(false);
  const [viewTab, setViewTab] = useState<'optimized' | 'original' | 'diff'>('optimized');

  const handleCopy = () => {
    navigator.clipboard.writeText(result.improvedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = result.improvedPrompt.split('\n').length;
  const wordCount = result.improvedPrompt.trim().split(/\s+/).length;
  const origWordCount = originalPrompt.trim().split(/\s+/).length;
  const origCharCount = originalPrompt.length;
  const improvement = result.score - originalScore;

  const diffTokens = useMemo(
    () => computeDiff(originalPrompt, result.improvedPrompt),
    [originalPrompt, result.improvedPrompt]
  );

  const openInAI = (url: string) => {
    const encoded = encodeURIComponent(result.improvedPrompt);
    window.open(url.replace('PROMPT', encoded), '_blank');
  };

  return (
    <div className="relative w-full">
      {/* PRO-LEVEL BACKGROUND LAYER */}
      <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none bg-[#09090b]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50" />
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-tactical-500/10 blur-[120px] rounded-full opacity-70" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-emerald-900/20 blur-[130px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="space-y-20 md:space-y-32 relative z-10">

        {/* ═══ 1. THE FORGED OUTPUT ═══════════════════════════════ */}
        <section id="forged-output" className="space-y-10 px-4 sm:px-0">
          <div className="w-full lg:max-w-[85%] lg:mx-auto space-y-10 md:space-y-12">

            {/* Header + Copy */}
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 md:gap-10">
              <div className="text-center md:text-left space-y-4 w-full md:w-auto relative">
                <div className="absolute top-1/2 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-[-20%] -translate-y-1/2 w-[300px] h-[300px] bg-tactical-500/20 blur-[100px] rounded-full opacity-50 pointer-events-none" />
                <div className="relative inline-flex items-center space-x-3 px-3 py-1 bg-zinc-900/80 border border-white/10 rounded-full mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-tactical-500 animate-pulse" />
                  <span className="text-[8px] md:text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em]">Revision 01 • Production Ready</span>
                </div>
                <h3 className="text-3xl sm:text-4xl md:text-6xl font-black text-zinc-100 tracking-tight leading-none">The Forged Output</h3>
                <p className="text-zinc-500 font-bold text-[10px] md:text-[12px] uppercase tracking-[0.3em] md:tracking-[0.4em]">Optimized structural logic with high-density precision</p>
              </div>

              <div className="flex items-center space-x-4 w-full md:w-auto">
                <button
                  onClick={handleCopy}
                  className={`h-12 md:h-14 px-6 md:px-10 rounded-full text-[11px] md:text-[13px] font-black transition-all active:scale-95 flex items-center space-x-3 w-full md:w-auto justify-center ${copied ? 'bg-tactical-600 text-white' : 'bg-zinc-100 text-zinc-950 hover:bg-white shadow-[0_15px_40px_-5px_rgba(255,255,255,0.2)]'
                    }`}
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                      <span className="uppercase">Copied</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                      <span className="uppercase">Copy Logic</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Word count comparison */}
            <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest font-mono">
              <span>Original: {origWordCount} words / {origCharCount} chars</span>
              <span className="text-zinc-700">→</span>
              <span className="text-tactical-400">Optimized: {wordCount} words / {result.improvedPrompt.length} chars</span>
            </div>

            {/* View tabs */}
            <div className="flex items-center gap-1 bg-zinc-900/50 border border-white/5 rounded-lg p-1 w-fit">
              {(['original', 'optimized', 'diff'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setViewTab(tab)}
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${viewTab === tab ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                  {tab === 'diff' ? 'Diff View' : tab}
                </button>
              ))}
            </div>

            {/* Editor Panel */}
            <div className="relative w-full group overflow-hidden animate-reveal [animation-delay:400ms]">
              <div className="glass-panel-heavy rounded-[24px] overflow-hidden ring-1 ring-white/10 w-full flex flex-col shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent pointer-events-none" />

                {/* Toolbar */}
                <div className="h-14 border-b border-white/5 px-6 flex items-center justify-between bg-zinc-950/80 backdrop-blur-xl">
                  <div className="flex items-center space-x-8">
                    <div className="flex space-x-2 group/actions">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                      <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                      <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                    </div>
                    <div className="hidden lg:flex items-center">
                      <div className="flex items-center space-x-2 px-4 py-1.5 bg-zinc-800/40 rounded-t-lg border-t border-x border-white/5 relative top-[1px]">
                        <svg className="w-3 h-3 text-tactical-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <span className="text-[11px] font-medium text-zinc-300">
                          {viewTab === 'original' ? 'original_prompt.txt' : viewTab === 'diff' ? 'diff_view.patch' : 'optimized_prompt.v2'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-1 bg-zinc-900 border border-white/10 rounded-md shadow-inner">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">UTF-8</span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-row min-h-[400px] md:min-h-[500px]">
                  <div className="hidden sm:flex w-16 border-r border-white/5 bg-zinc-950/40 flex-col items-end pr-4 py-8 select-none font-mono text-[11px] text-zinc-700 leading-[1.8]">
                    {Array.from({ length: Math.max(viewTab === 'original' ? originalPrompt.split('\n').length : lineCount, 12) }).map((_, i) => (
                      <div key={i} className="h-[1.8em]">{(i + 1)}</div>
                    ))}
                  </div>

                  <div className="flex-1 p-6 md:p-10 bg-[#0B0C10] relative overflow-auto no-scrollbar cursor-text">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tactical-500/[0.02] blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="relative z-10 mono text-[15px] md:text-[16px] leading-[1.8] whitespace-pre-wrap selection:bg-tactical-500/30 selection:text-white max-w-4xl font-normal tracking-wide">
                      {viewTab === 'original' && (
                        <span className="text-zinc-400">{originalPrompt || '(no original prompt captured)'}</span>
                      )}
                      {viewTab === 'optimized' && (
                        <span className="text-zinc-100">{result.improvedPrompt}</span>
                      )}
                      {viewTab === 'diff' && (
                        <div>
                          {diffTokens.map((tok, i) => (
                            <span key={i} className={
                              tok.type === 'remove' ? 'bg-rose-500/20 text-rose-400 line-through' :
                              tok.type === 'add' ? 'bg-emerald-500/15 text-emerald-300' :
                              'text-zinc-400'
                            }>{tok.text}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="h-8 border-t border-white/5 px-4 flex items-center justify-between bg-zinc-950 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  <div className="flex items-center space-x-2 text-emerald-500/80">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    <span>No Issues Found</span>
                  </div>
                  <div className="flex items-center space-x-4 opacity-50">
                    <span>Ln {lineCount}, Col 1</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick-send buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mr-1">Open in:</span>
              {[
                { name: 'ChatGPT', url: 'https://chat.openai.com/?q=PROMPT', color: 'hover:border-emerald-500/40 hover:text-emerald-400' },
                { name: 'Claude', url: 'https://claude.ai/new?q=PROMPT', color: 'hover:border-amber-500/40 hover:text-amber-400' },
                { name: 'Gemini', url: 'https://gemini.google.com/app?q=PROMPT', color: 'hover:border-blue-500/40 hover:text-blue-400' },
              ].map(ai => (
                <button
                  key={ai.name}
                  onClick={() => openInAI(ai.url)}
                  className={`px-4 py-2 bg-[#111] border border-[#222] rounded-lg text-[10px] font-bold text-zinc-500 uppercase tracking-widest transition-all ${ai.color}`}
                >
                  {ai.name} ↗
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 2. BEFORE / AFTER SCORE ═══════════════════════════ */}
        <section className="px-4 sm:px-0">
          <div className="w-full lg:max-w-[85%] lg:mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-10 items-center">
              {/* BEFORE */}
              <div className="text-center space-y-2 opacity-60">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Before</span>
                <div className="text-6xl md:text-8xl font-black text-zinc-600 tracking-tighter leading-none">{originalScore}</div>
                <span className="text-zinc-700 text-sm font-bold">/100</span>
              </div>

              {/* Arrow + improvement */}
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-tactical-500/10 border border-tactical-500/20 flex items-center justify-center animate-pulse">
                  <svg className="w-5 h-5 text-tactical-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </div>
                <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-black uppercase tracking-widest">
                  +{improvement} points
                </span>
              </div>

              {/* AFTER */}
              <div className="text-center space-y-2">
                <span className="text-[10px] font-black text-tactical-500 uppercase tracking-[0.3em]">After</span>
                <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-emerald-300 to-emerald-600 tracking-tighter leading-none">{result.score}</div>
                <span className="text-emerald-500/60 text-sm font-bold">/100</span>
              </div>
            </div>

            <p className="text-center mt-8 text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
              Your prompt improved by <span className="text-emerald-400">+{improvement} points</span>
            </p>
          </div>
        </section>

        {/* ═══ 3. AUDIT SUMMARY ══════════════════════════════════ */}
        <section className="pt-24 md:pt-32 border-t border-white/10 space-y-12 md:space-y-16 px-4 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-20 items-start">

            {/* Grade Sidebar */}
            <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-8 md:space-y-10 animate-reveal">
              <div className="text-center lg:text-left relative">
                <div className="absolute -inset-10 bg-tactical-500/10 blur-[60px] rounded-full opacity-60 pointer-events-none animate-pulse"></div>
                <span className="relative text-[10px] md:text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-4 block pl-1">Overall Performance</span>
                <div className="relative flex items-baseline justify-center lg:justify-start">
                  <span className="text-[100px] sm:text-[120px] md:text-[140px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600 leading-[0.85] tracking-tighter drop-shadow-2xl z-10">
                    {result.score}
                  </span>
                  <span className="text-zinc-600 text-2xl md:text-3xl font-black ml-4 rotate-[-5deg] origin-bottom-left opacity-60">/100</span>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                <div className="glass-card p-6 rounded-[20px] flex flex-col items-center lg:items-start justify-center group cursor-default">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 group-hover:text-tactical-400 transition-colors">Logic Level</span>
                  <span className="text-[14px] font-bold text-zinc-100 uppercase tracking-wide">{result.difficulty}</span>
                </div>
                <div className="glass-card p-6 rounded-[20px] flex flex-col items-center lg:items-start justify-center group cursor-default">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 group-hover:text-tactical-400 transition-colors">Architecture</span>
                  <span className="text-[14px] font-bold text-zinc-100 uppercase truncate max-w-full tracking-wide">{result.useCase}</span>
                </div>
              </div>
            </div>

            {/* Expert Review Body */}
            <div className="lg:col-span-8 space-y-12 md:space-y-16 animate-reveal [animation-delay:200ms]">
              <div className="space-y-8 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-6">
                  <div className="hidden xs:block w-12 h-[1px] bg-gradient-to-r from-zinc-500 to-transparent" />
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-100 tracking-tight text-glow">Audit Summary</h3>
                </div>
                <p className="text-base md:text-lg lg:text-xl text-zinc-300 font-medium leading-[1.8] max-w-3xl mx-auto lg:mx-0 tracking-wide">
                  {result.detailedAnalysis}
                </p>
              </div>

              {/* Strength/Fix Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center justify-center md:justify-start space-x-3 pl-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    <span>Success Vectors</span>
                  </h4>
                  <div className="space-y-4">
                    {result.strengths.map((s, i) => (
                      <div key={i} className="glass-card flex items-start space-x-5 p-5 rounded-[20px] group transition-all duration-300">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 ring-1 ring-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
                          <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span className="text-[14px] font-medium text-zinc-300 leading-relaxed group-hover:text-zinc-100 transition-colors">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center justify-center md:justify-start space-x-3 pl-1">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                    <span>Optimization Targets</span>
                  </h4>
                  <div className="space-y-4">
                    {result.improvements.map((im, i) => (
                      <div key={i} className="glass-card flex items-start space-x-5 p-5 rounded-[20px] group transition-all duration-300">
                        <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 ring-1 ring-amber-500/20 group-hover:bg-amber-500/20 transition-all">
                          <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <span className="text-[14px] font-medium text-zinc-300 leading-relaxed group-hover:text-zinc-100 transition-colors">{im}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <MetricsCard metrics={result.metrics} />
        </section>

        <div className="flex justify-center pt-8 md:pt-16 pb-12 animate-reveal [animation-delay:600ms]">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-10 py-4 rounded-full border border-white/5 text-[10px] font-black text-zinc-500 hover:text-zinc-100 hover:border-white/20 uppercase tracking-[0.3em] transition-all flex items-center space-x-3 group bg-zinc-900/40 backdrop-blur-sm hover:translate-y-[-2px] hover:shadow-lg"
          >
            <svg className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" /></svg>
            <span>Return to Top</span>
          </button>
        </div>
      </div>
    </div>
  );
};
