'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { PromptMode, AppState, ModeDetails, User } from '../../types';
import { analyzePrompt } from '../../services/geminiService';
import { ResultsDashboard } from '../../components/ResultsDashboard';
import { AuthView } from '../../components/AuthView';
import { supabase } from '../../services/supabaseClient';
import { fetchUserHistory, savePromptToHistory } from '../../services/historyService';

import { AuthProvider, useAuth } from '../../components/AuthProvider';

function Workbench() {
  const { user, login, logout } = useAuth();
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

  useEffect(() => {
    if (user) {
      setState(prev => ({ ...prev, user }));
      fetchUserHistory(user.id).then(history => setState(prev => ({ ...prev, history })));
    } else {
      setState(prev => ({ ...prev, user: null }));
    }
  }, [user]);

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

    // Scroll to forge output area immediately so user sees the loading state
    setTimeout(() => {
      document.getElementById('forge-output')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    const startTime = Date.now();

    try {
      const result = await analyzePrompt(state.originalPrompt, state.mode);
      const duration = Date.now() - startTime;

      if (state.user) {
        await savePromptToHistory(
          state.user.id,
          state.originalPrompt,
          result.improvedPrompt,
          result.score,
          {
            score_breakdown: result.metrics,
            model: state.user.preferences?.model || 'gpt-4',
            duration_ms: duration,
            status: 'success'
          }
        );
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
      history={state.history}
      onSignInClick={() => setState(prev => ({ ...prev, currentView: 'auth' }))}
      variant="minimal"
    >
      {state.currentView === 'auth' ? (
        <AuthView
          initialMode="signin"
          onSuccess={(user) => {
            login(user);
            setState(prev => ({ ...prev, currentView: 'workbench' }));
          }}
          onBack={() => setState(prev => ({ ...prev, currentView: 'workbench' }))}
        />
      ) : (
        <div className="w-full max-w-5xl mx-auto flex flex-col min-h-[calc(100vh-80px)] justify-center">
          {/* Minimal header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-black text-zinc-100 tracking-tight">
              Neural <span className="text-tactical-500">Forge</span>
            </h1>
            <p className="text-zinc-500 text-xs md:text-sm mt-2">
              Enter your prompt below and let AI refine it.
            </p>
          </div>

          {/* Workbench Terminal */}
          <div id="forge-terminal" className="relative group w-full">
            <div className="relative tool-bg tool-border rounded-2xl shadow-2xl shadow-black/40 overflow-hidden bg-[#09090b]">
              <div className="h-10 border-b border-white/5 px-5 flex items-center justify-between bg-zinc-950/30">
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                </div>
                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">forge.prompt</span>
              </div>

              <div className="p-0 relative">
                <textarea
                  className="w-full h-56 md:h-64 bg-transparent text-zinc-300 placeholder-zinc-700 focus:outline-none resize-none mono text-sm leading-7 px-6 pt-5 selection:bg-tactical-500/20"
                  placeholder="// Type or paste your prompt here..."
                  value={state.originalPrompt}
                  onChange={(e) => setState(prev => ({ ...prev, originalPrompt: e.target.value }))}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-white/5 gap-3 bg-zinc-950/30">
                <div className="w-full sm:w-64 relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full h-10 bg-zinc-950/50 border border-white/10 rounded-lg px-4 flex items-center justify-between hover:border-tactical-500/30 transition-all"
                  >
                    <div className="text-left">
                      <div className="text-xs font-bold text-zinc-100">{state.mode}</div>
                      <div className="text-[8px] text-zinc-500 uppercase tracking-widest">Mode</div>
                    </div>
                    <svg className={`w-3.5 h-3.5 text-zinc-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute bottom-full mb-3 w-full bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                      {Object.values(PromptMode).map(m => (
                        <button
                          key={m}
                          onClick={() => { setState(prev => ({ ...prev, mode: m })); setIsDropdownOpen(false); }}
                          className="w-full px-5 py-3 text-left hover:bg-zinc-800 transition-colors border-b border-white/5 last:border-0"
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
                  className="h-10 w-full sm:w-auto px-8 bg-gradient-to-r from-tactical-500 to-tactical-600 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-tactical-900/20 active:scale-95 disabled:opacity-50 disabled:shadow-none btn-sweep whitespace-nowrap"
                >
                  {state.isAnalyzing ? 'Processing...' : 'Forge'}
                </button>
              </div>

              {/* Forged Output — directly inside terminal */}
              {state.error && (
                <div className="px-5 pb-4 border-t border-white/5">
                  <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs font-bold text-center">
                    {state.error}
                  </div>
                </div>
              )}

              {state.result && (
                <div id="results" className="border-t border-white/5 p-5 animate-in fade-in slide-in-from-bottom-5 duration-700">
                  <ResultsDashboard result={state.result} />
                </div>
              )}
            </div>

            {state.isAnalyzing && (
              <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-xl flex flex-col items-center justify-center space-y-6 z-50 rounded-2xl">
                <div className="w-16 h-16 rounded-full border-t-2 border-tactical-500 animate-spin" />
                <div className="text-center">
                  <p className="text-lg font-bold text-zinc-100 mb-2">{loadingMessages[loadingStep]}</p>
                  <div className="flex space-x-1 justify-center">
                    {[0, 1, 2].map(i => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full bg-tactical-500 ${loadingStep % 3 === i ? 'opacity-100 scale-125' : 'opacity-20'} transition-all`} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Scroll anchor for auto-scroll on submit */}
          <div id="forge-output" />

          {/* History Section */}
          {state.user && state.history.length > 0 && (
            <div className="mt-16 border-t border-white/5 pt-10 pb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-black text-zinc-100 uppercase tracking-widest">History</h3>
                  <p className="text-zinc-500 text-xs mt-1">Your recent refinements.</p>
                </div>
                <button className="text-xs font-bold text-tactical-500 hover:text-tactical-400 uppercase tracking-wider transition-colors">
                  View All →
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {state.history.slice(0, 5).map((item) => (
                  <div key={item.id} className="group relative bg-zinc-950/30 border border-white/5 hover:border-tactical-500/30 rounded-xl p-5 transition-all hover:bg-zinc-900/40">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${item.score >= 90 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          item.score >= 70 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                          {item.score}
                        </div>
                        <span className="text-[10px] text-zinc-600 font-mono">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setState(prev => ({ ...prev, originalPrompt: item.original_prompt }));
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="p-1.5 hover:bg-white/5 rounded-md text-zinc-500 hover:text-white transition-colors"
                          title="Re-run"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        </button>
                        <button
                          onClick={async () => {
                            if (!confirm('Delete this history item?')) return;
                            try {
                              await fetch(`/api/history/${item.id}`, { method: 'DELETE' });
                              const updated = await fetchUserHistory(state.user!.id);
                              setState(prev => ({ ...prev, history: updated }));
                            } catch (e) { console.error(e); }
                          }}
                          className="p-1.5 hover:bg-rose-500/10 rounded-md text-zinc-600 hover:text-rose-400 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Input</p>
                        <p className="text-sm text-zinc-400 line-clamp-2 font-mono">{item.original_prompt}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-tactical-500 uppercase tracking-widest mb-1">Output</p>
                        <p className="text-sm text-zinc-300 line-clamp-2 font-mono">{item.improved_prompt}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}

export default function Page() {
  return <Workbench />;
}
