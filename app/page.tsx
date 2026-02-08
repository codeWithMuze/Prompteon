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
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Neural Bridge Active</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-zinc-100 tracking-tight leading-none">
              Forge Elite <br /> <span className="text-zinc-600">AI Instructions</span>
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
              Transform basic inputs into architectural-grade prompts with industrial analysis.
            </p>
          </div>

          <div className="relative group">
            <div className="tool-bg tool-border rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden ring-1 ring-white/10">
              <div className="h-12 border-b border-white/5 px-6 flex items-center justify-between bg-zinc-950/30">
                <div className="flex space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                </div>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Workbench Terminal // src_forge.v1</span>
                <span className="text-[10px] font-mono text-zinc-600">STABLE_RELEASE</span>
              </div>

              <div className="p-8 md:p-12 space-y-10 relative">
                <textarea
                  className="w-full h-64 bg-transparent text-zinc-200 placeholder-zinc-800 focus:outline-none resize-none mono text-lg leading-relaxed"
                  placeholder="// Paste raw prompt logic here..."
                  value={state.originalPrompt}
                  onChange={(e) => setState(prev => ({ ...prev, originalPrompt: e.target.value }))}
                />

                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 gap-6">
                  <div className="w-full md:w-80 relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full h-14 bg-zinc-900/50 border border-white/10 rounded-2xl px-6 flex items-center justify-between hover:bg-zinc-900 transition-all group"
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
                    className="h-14 px-12 bg-zinc-100 text-zinc-950 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white transition-all shadow-2xl active:scale-95 disabled:opacity-50 btn-sweep"
                  >
                    {state.isAnalyzing ? 'Forging...' : 'Begin Forge'}
                  </button>
                </div>
              </div>

              {state.isAnalyzing && (
                <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 z-50">
                  <div className="w-24 h-24 rounded-full border-t-2 border-emerald-500 animate-spin" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-zinc-100 mb-2">{loadingMessages[loadingStep]}</p>
                    <div className="flex space-x-1 justify-center">
                      {[0, 1, 2].map(i => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${loadingStep % 3 === i ? 'opacity-100 scale-125' : 'opacity-20'} transition-all`} />
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
          </div>

          {state.result && (
            <div id="results" className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <ResultsDashboard result={state.result} />
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}