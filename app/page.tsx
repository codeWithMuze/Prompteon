'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { PromptMode, AppState, ModeDetails, User } from '../types';
import { analyzePrompt } from '../services/geminiService';
import { ResultsDashboard } from '../components/ResultsDashboard';
import { AuthView } from '../components/AuthView';
import { supabase } from '../services/supabaseClient';
import { fetchUserHistory, savePromptToHistory } from '../services/historyService';

export default function Page() {
  const [state, setState] = useState<AppState>({
    originalPrompt: '',
    mode: PromptMode.GENERAL,
    isAnalyzing: false,
    result: null,
    error: null,
    user: null,
    currentView: 'workbench',
    history: [],
  });

  const [loadingStep, setLoadingStep] = useState(0);
  const loadingMessages = [
    "Priming Neural Forge...",
    "Scanning Syntax Logic...",
    "Injecting Structural Integrity...",
    "Optimizing Token Density...",
    "Calibrating Task Alignment...",
    "Finalizing Semantic Audit..."
  ];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata.name || 'Architect',
          plan: 'free',
        };
        const history = await fetchUserHistory(user.id);
        setState(prev => ({ ...prev, user, history }));
      }
    };
    initAuth();
  }, []);

  useEffect(() => {
    let interval: any;
    if (state.isAnalyzing) {
      interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % loadingMessages.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [state.isAnalyzing]);

  const handleForge = async () => {
    if (!state.originalPrompt.trim()) {
      setState(prev => ({ ...prev, error: 'Provide raw input to begin forging.' }));
      return;
    }

    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));
    try {
      const result = await analyzePrompt(state.originalPrompt, state.mode);

      if (state.user) {
        await savePromptToHistory(state.user.id, state.originalPrompt, result.improvedPrompt, result.score);
        const history = await fetchUserHistory(state.user.id);
        setState(prev => ({ ...prev, history }));
      }

      setState(prev => ({ ...prev, isAnalyzing: false, result }));

      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } catch (err: any) {
      setState(prev => ({ ...prev, isAnalyzing: false, error: err.message }));
    }
  };

  return (
    <Layout
      user={state.user}
      history={state.history}
      onSignInClick={() => setState(prev => ({ ...prev, currentView: 'auth' }))}
      onLogout={() => supabase.auth.signOut().then(() => window.location.reload())}
    >
      {state.currentView === 'auth' ? (
        <AuthView
          initialMode="signin"
          onSuccess={(user) => setState(prev => ({ ...prev, user, currentView: 'workbench' }))}
          onBack={() => setState(prev => ({ ...prev, currentView: 'workbench' }))}
        />
      ) : (
        <div className="w-full max-w-6xl mx-auto space-y-24">
          <div className="text-center space-y-6 pt-12">
            <div className="inline-flex items-center space-x-2.5 px-3 py-1.5 md:px-4 md:py-2 bg-zinc-900/40 backdrop-blur-md border border-tactical-500/20 rounded-full shadow-[0_0_15px_-3px_rgba(88,129,87,0.3)] hover:border-tactical-500/40 hover:bg-zinc-900/60 transition-all duration-300 group cursor-default shadow-lg shadow-tactical-900/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tactical-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-tactical-500 shadow-[0_0_10px_#588157]"></span>
              </span>
              <span className="text-[10px] md:text-[11px] font-bold text-zinc-400 tracking-[0.2em] uppercase group-hover:text-zinc-200 transition-colors">
                Neural <span className="text-tactical-300">Bridge</span> <span className="text-tactical-400 drop-shadow-[0_0_8px_rgba(88,129,87,0.5)]">Active</span>
              </span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-zinc-100 tracking-tighter leading-none">
              Architect Precision <br /> <span className="text-gradient">AI Prompts</span>
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
              Transform basic inputs into architectural-grade prompts with industrial analysis.
            </p>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-tactical-800 rounded-[2.5rem] blur-xl opacity-20"></div>
            <div className="relative tool-bg tool-border rounded-[2rem] shadow-2xl shadow-tactical-900/30 overflow-hidden bg-[#09090b]">
              <div className="h-12 border-b border-white/5 px-6 flex items-center justify-between bg-zinc-950/30">
                <div className="flex space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                </div>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Workbench Terminal // src_forge.v1</span>
                <span className="text-[10px] font-mono text-zinc-600">STABLE_RELEASE</span>
              </div>

              {/* Editor Status Bar */}
              <div className="flex items-center justify-between px-6 py-2 border-b border-white/5 bg-zinc-950/50 text-[10px] text-zinc-500 font-mono">
                <div className="flex space-x-4">
                  <span>main.prompt</span>
                  <span>UTF-8</span>
                </div>
                <div className="flex space-x-4">
                  <span>Ln 1, Col 1</span>
                  <span>Forge AI</span>
                </div>
              </div>

              <div className="p-0 relative group">
                <div className="absolute left-0 top-0 bottom-0 w-12 border-r border-white/5 bg-zinc-950/20 text-right pr-3 pt-6 text-zinc-700 font-mono text-sm leading-8 select-none">
                  1<br />2<br />3<br />4<br />5
                </div>
                <textarea
                  className="w-full h-80 bg-transparent text-zinc-300 placeholder-zinc-700 focus:outline-none resize-none mono text-sm md:text-base leading-8 pl-16 pr-8 pt-6 selection:bg-tactical-500/20"
                  placeholder="// Initialize prompt sequence..."
                  value={state.originalPrompt}
                  onChange={(e) => setState(prev => ({ ...prev, originalPrompt: e.target.value }))}
                />
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-8 border-t border-white/5 gap-6 bg-zinc-900/40">
                <div className="w-full md:w-80 relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full h-12 bg-zinc-950/50 border border-white/10 rounded-xl px-5 flex items-center justify-between hover:bg-zinc-900 hover:border-tactical-500/30 transition-all group"
                  >
                    <div className="text-left">
                      <div className="text-[13px] font-bold text-zinc-100">{state.mode}</div>
                      <div className="text-[9px] text-zinc-500 uppercase tracking-widest">Forge Profile</div>
                    </div>
                    <svg className={`w-4 h-4 text-zinc-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute bottom-full mb-4 w-full bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                      {Object.values(PromptMode).map(m => (
                        <button
                          key={m}
                          onClick={() => { setState(prev => ({ ...prev, mode: m })); setIsDropdownOpen(false); }}
                          className="w-full px-6 py-4 text-left hover:bg-zinc-800 transition-colors border-b border-white/5 last:border-0"
                        >
                          <div className="text-xs font-bold text-zinc-100">{m}</div>
                          <div className="text-[9px] text-zinc-500 truncate">{ModeDetails[m]}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleForge}
                  disabled={state.isAnalyzing}
                  className="h-12 px-10 bg-gradient-to-r from-tactical-500 to-tactical-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-tactical-900/20 active:scale-95 disabled:opacity-50 disabled:shadow-none btn-sweep"
                >
                  {state.isAnalyzing ? 'Processing...' : 'Initialize Forge'}
                </button>
              </div>
            </div>

            {state.isAnalyzing && (
              <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 z-50">
                <div className="w-24 h-24 rounded-full border-t-2 border-tactical-500 animate-spin" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-zinc-100 mb-2">{loadingMessages[loadingStep]}</p>
                  <div className="flex space-x-1 justify-center">
                    {[0, 1, 2].map(i => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full bg-tactical-500 ${loadingStep % 3 === i ? 'opacity-100 scale-125' : 'opacity-20'} transition-all`} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {state.error && (
            <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-bold text-center">
              {state.error}
            </div>
          )}

          {state.result && (
            <div id="results" className="mt-20 animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <ResultsDashboard result={state.result} />
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}