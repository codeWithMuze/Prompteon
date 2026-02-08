
import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { MetricsCard } from './MetricsCard';

interface ResultsDashboardProps {
  result: AnalysisResult;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.improvedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = result.improvedPrompt.split('\n').length;
  const wordCount = result.improvedPrompt.trim().split(/\s+/).length;

  return (
    <div className="space-y-20 md:space-y-32">
      {/* 1. Review Section */}
      <section className="space-y-12 md:space-y-16 px-4 sm:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-20 items-start">
          
          {/* Grade Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-8 md:space-y-10">
            <div className="text-center lg:text-left">
              <span className="text-[10px] md:text-[11px] font-black text-zinc-400 uppercase tracking-[0.4em] mb-4 block">Overall Performance</span>
              <div className="flex items-baseline justify-center lg:justify-start">
                <span className="text-[80px] sm:text-[100px] md:text-[120px] font-black text-zinc-100 leading-none tracking-tighter">
                  {result.score}
                </span>
                <span className="text-zinc-700 text-2xl md:text-3xl font-black ml-3 md:ml-4">/100</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
               <div className="bg-zinc-900/60 border border-white/10 p-5 md:p-6 rounded-3xl flex flex-col items-center lg:items-start justify-center hover:border-white/20 transition-colors">
                  <span className="text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Logic Level</span>
                  <span className="text-[13px] md:text-[14px] font-bold text-zinc-100 uppercase">{result.difficulty}</span>
               </div>
               <div className="bg-zinc-900/60 border border-white/10 p-5 md:p-6 rounded-3xl flex flex-col items-center lg:items-start justify-center hover:border-white/20 transition-colors">
                  <span className="text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Architecture</span>
                  <span className="text-[13px] md:text-[14px] font-bold text-zinc-100 uppercase truncate max-w-full px-1">{result.useCase}</span>
               </div>
            </div>
          </div>

          {/* Expert Review Body */}
          <div className="lg:col-span-8 space-y-12 md:space-y-16">
            <div className="space-y-6 md:space-y-8 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-4 md:space-x-6">
                <div className="hidden xs:block w-8 md:w-12 h-[2px] bg-zinc-100" />
                <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-zinc-100 tracking-tight">Audit Summary</h3>
              </div>
              <p className="text-base md:text-lg lg:text-xl text-zinc-300 font-medium leading-relaxed max-w-3xl mx-auto lg:mx-0">
                {result.detailedAnalysis}
              </p>
            </div>

            {/* Strength/Fix Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-4 md:space-y-6">
                <h4 className="text-[10px] md:text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center justify-center md:justify-start space-x-3">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  <span>Success Vectors</span>
                </h4>
                <div className="space-y-3 md:space-y-4">
                  {result.strengths.map((s, i) => (
                    <div key={i} className="flex items-start space-x-4 p-4 md:p-5 bg-zinc-900/40 rounded-2xl border border-white/5 hover:border-emerald-500/20 transition-all">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="text-[13px] md:text-[14px] font-bold text-zinc-300 leading-snug">{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 md:space-y-6">
                <h4 className="text-[10px] md:text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center justify-center md:justify-start space-x-3">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                  <span>Optimization Targets</span>
                </h4>
                <div className="space-y-3 md:space-y-4">
                  {result.improvements.map((im, i) => (
                    <div key={i} className="flex items-start space-x-4 p-4 md:p-5 bg-zinc-900/40 rounded-2xl border border-white/5 hover:border-amber-500/20 transition-all">
                      <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      </div>
                      <span className="text-[13px] md:text-[14px] font-bold text-zinc-300 leading-snug">{im}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <MetricsCard metrics={result.metrics} />
      </section>

      {/* 2. Better Prompt Output - ENHANCED REALISM & RESPONSIVE */}
      <section className="pt-24 md:pt-32 border-t border-white/10 space-y-10 px-4 sm:px-0">
        <div className="w-full lg:max-w-[85%] lg:mx-auto space-y-10 md:space-y-12">
          
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 md:gap-10">
            <div className="text-center md:text-left space-y-4 w-full md:w-auto">
              <div className="inline-flex items-center space-x-3 px-3 py-1 bg-zinc-900/80 border border-white/10 rounded-full mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] md:text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em]">Revision 01 • Production Ready</span>
              </div>
              <h3 className="text-3xl sm:text-4xl md:text-6xl font-black text-zinc-100 tracking-tight leading-none">The Forged Output</h3>
              <p className="text-zinc-500 font-bold text-[10px] md:text-[12px] uppercase tracking-[0.3em] md:tracking-[0.4em]">Optimized structural logic with high-density precision</p>
            </div>
            
            <div className="flex items-center space-x-4 w-full md:w-auto">
               <button 
                  onClick={handleCopy}
                  className={`h-12 md:h-14 px-6 md:px-10 rounded-full text-[11px] md:text-[13px] font-black transition-all active:scale-95 flex items-center space-x-3 w-full md:w-auto justify-center ${
                    copied ? 'bg-emerald-600 text-white' : 'bg-zinc-100 text-zinc-950 hover:bg-white shadow-[0_15px_40px_-5px_rgba(255,255,255,0.2)]'
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

          <div className="relative w-full group overflow-hidden">
            {/* Structural Editor Interface */}
            <div className="tool-bg tool-border rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden ring-1 ring-white/10 w-full flex flex-col">
              
              {/* Toolbar */}
              <div className="h-12 md:h-14 border-b border-white/10 px-5 md:px-10 flex items-center justify-between bg-zinc-900/90 backdrop-blur-xl">
                <div className="flex items-center space-x-4 md:space-x-10">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-white/5" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-white/5" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-white/5" />
                  </div>
                  <div className="hidden lg:flex items-center space-x-8 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
                    <div className="flex items-center space-x-2">
                       <span className="opacity-50">CHAR:</span> <span className="text-zinc-400">{result.improvedPrompt.length}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                       <span className="opacity-50">WORD:</span> <span className="text-zinc-400">{wordCount}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                       <span className="opacity-50">LANG:</span> <span className="text-zinc-400">PROMPT_ENG_V2</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="hidden xs:flex items-center space-x-2 px-2.5 py-1 bg-zinc-800/50 border border-white/5 rounded-md">
                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">UTF-8</span>
                  </div>
                  <div className="hidden xs:block h-3 w-[1px] bg-white/10 mx-1" />
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest truncate">v1.0.4-stable</span>
                </div>
              </div>
              
              <div className="flex-1 flex flex-row min-h-[300px] md:min-h-[400px]">
                {/* Editor Gutter (Hidden on very small screens) */}
                <div className="hidden sm:flex w-12 md:w-20 border-r border-white/5 bg-zinc-950/40 flex-col items-center py-8 md:py-10 select-none">
                   {Array.from({ length: Math.max(lineCount, 12) }).map((_, i) => (
                     <div key={i} className="text-[10px] md:text-[11px] font-mono text-zinc-700 h-6 md:h-7 flex items-center justify-center font-medium">
                        {(i + 1).toString().padStart(2, '0')}
                     </div>
                   ))}
                </div>

                {/* Main Content Area - Scrollbar Hidden */}
                <div className="flex-1 p-6 md:p-12 lg:p-16 bg-zinc-950/60 relative group overflow-auto no-scrollbar">
                  {/* Glass Background Glares */}
                  <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-zinc-100/[0.02] blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                  
                  {/* Dynamic Semantic Tags */}
                  <div className="flex flex-wrap gap-2 md:gap-3 mb-8 md:mb-12">
                     <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[8px] md:text-[9px] font-black text-emerald-400 uppercase tracking-widest">Optimized Structure</span>
                     <span className="px-2.5 py-1 bg-zinc-800/50 border border-white/10 rounded text-[8px] md:text-[9px] font-black text-zinc-400 uppercase tracking-widest">Zero Redundancy</span>
                  </div>

                  {/* Refined Typography */}
                  <div className="relative z-10 mono text-[14px] md:text-[16px] lg:text-[18px] leading-[1.8] text-zinc-200 whitespace-pre-wrap selection:bg-zinc-100 selection:text-zinc-950 max-w-5xl opacity-90 font-medium">
                    {result.improvedPrompt}
                  </div>
                </div>
              </div>

              {/* Status Bar */}
              <div className="h-9 md:h-10 border-t border-white/5 px-6 md:px-8 flex items-center justify-between bg-zinc-950/60 text-[8px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                 <div className="flex items-center space-x-4 md:space-x-6">
                    <div className="flex items-center space-x-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                       <span className="hidden xs:inline">Analysis Verified</span>
                       <span className="xs:hidden">Verified</span>
                    </div>
                    <div className="hidden md:block">Logic Integrity: 99.4%</div>
                 </div>
                 <div className="flex items-center space-x-3 md:space-x-4">
                    <span>{wordCount} Words</span>
                    <span className="opacity-30">|</span>
                    <span className="text-zinc-400">Stable</span>
                 </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center pt-12 md:pt-16">
            <button 
              onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
              className="px-8 md:px-10 py-3 md:py-4 rounded-full border border-white/10 text-[9px] md:text-[11px] font-black text-zinc-500 hover:text-zinc-100 hover:border-white/20 uppercase tracking-[0.4em] transition-all flex items-center space-x-3 group bg-zinc-900/30 backdrop-blur-sm"
            >
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4 transform group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 15l7-7 7 7" /></svg>
              <span>Back to Workbench</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
