'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { PromptMode, AppState, ModeDetails, ModeIcons, User } from '../../types';
import { analyzePrompt } from '../../services/geminiService';
import { ResultsDashboard } from '../../components/ResultsDashboard';
import { AuthView } from '../../components/AuthView';
import { supabase } from '../../services/supabaseClient';
import { fetchUserHistory, savePromptToHistory } from '../../services/historyService';
import { AuthProvider, useAuth } from '../../components/AuthProvider';

// ── Example prompts for "Try an example" and template cards ──────────
const EXAMPLE_PROMPT = "i need to study about node js and learn how to build backend apis for my project";

const TEMPLATE_CARDS = [
  { emoji: '🧑‍💻', label: 'Coding', prompt: 'fix my javascript code', mode: PromptMode.CODE },
  { emoji: '📣', label: 'Marketing', prompt: 'write me an instagram caption', mode: PromptMode.MARKETING },
  { emoji: '🔍', label: 'Research', prompt: 'tell me about climate change', mode: PromptMode.RESEARCH },
  { emoji: '✍️', label: 'Writing', prompt: 'write a short story', mode: PromptMode.CREATIVE },
  { emoji: '📊', label: 'Data', prompt: 'analyze my sales data', mode: PromptMode.DATA_ANALYTICS },
  { emoji: '🎨', label: 'Creative', prompt: 'give me logo ideas', mode: PromptMode.CREATIVE },
];

// ── Local history helpers ────────────────────────────────────────────
interface LocalHistoryItem {
  id: string;
  original: string;
  optimized: string;
  scoreBefore: number;
  scoreAfter: number;
  timestamp: number;
}

function getLocalHistory(): LocalHistoryItem[] {
  try {
    return JSON.parse(localStorage.getItem('prompteon_history') || '[]');
  } catch { return []; }
}

function saveLocalHistory(item: LocalHistoryItem) {
  const list = getLocalHistory();
  list.unshift(item);
  localStorage.setItem('prompteon_history', JSON.stringify(list.slice(0, 5)));
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// ── Compute a rough "original score" from raw prompt ─────────────────
function estimateOriginalScore(prompt: string): number {
  const words = prompt.trim().split(/\s+/).length;
  const hasQuestion = /\?/.test(prompt);
  const hasNewlines = /\n/.test(prompt);
  let score = Math.min(words * 1.5, 30);
  if (hasQuestion) score += 5;
  if (hasNewlines) score += 5;
  if (words > 20) score += 10;
  return Math.min(Math.round(score), 40);
}

// ═══════════════════════════════════════════════════════════════════════
// WORKBENCH COMPONENT
// ═══════════════════════════════════════════════════════════════════════
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

  // Track the original prompt text at time of forging (for diff view)
  const [forgedOriginal, setForgedOriginal] = useState('');
  const [originalScore, setOriginalScore] = useState(0);

  // Local history
  const [localHistory, setLocalHistory] = useState<LocalHistoryItem[]>([]);
  useEffect(() => { setLocalHistory(getLocalHistory()); }, []);

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
  const [showModeTooltip, setShowModeTooltip] = useState(false);
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

    const promptSnapshot = state.originalPrompt;
    const estScore = estimateOriginalScore(promptSnapshot);
    setForgedOriginal(promptSnapshot);
    setOriginalScore(estScore);

    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));
    const startTime = Date.now();

    try {
      const result = await analyzePrompt(state.originalPrompt, state.mode);
      const duration = Date.now() - startTime;

      // Save to localStorage history
      const histItem: LocalHistoryItem = {
        id: crypto.randomUUID(),
        original: promptSnapshot,
        optimized: result.improvedPrompt,
        scoreBefore: estScore,
        scoreAfter: result.score,
        timestamp: Date.now(),
      };
      saveLocalHistory(histItem);
      setLocalHistory(getLocalHistory());

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
        const el = document.getElementById('forged-output') || document.getElementById('results');
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 300);
    } catch (err: any) {
      setState(prev => ({ ...prev, isAnalyzing: false, error: err.message }));
    }
  };

  const fillExample = (prompt: string, mode?: PromptMode) => {
    setState(prev => ({
      ...prev,
      originalPrompt: prompt,
      mode: mode || prev.mode,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <div className="w-full max-w-5xl mx-auto flex flex-col min-h-[calc(100vh-80px)] justify-center px-4 sm:px-0">

          {/* ── Hero Header ─────────────────────────────────────── */}
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-black text-zinc-100 tracking-tight">
              Neural <span className="text-tactical-500">Forge</span>
            </h1>
            <p className="text-zinc-500 text-xs md:text-sm mt-2 max-w-md mx-auto">
              Paste a weak prompt. Get a production-ready one in seconds.
            </p>
          </div>

          {/* ── Social Proof Marquee ────────────────────────────── */}
          <div className="w-full overflow-hidden mb-8 relative">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#050608] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#050608] to-transparent z-10 pointer-events-none" />
            <div className="flex animate-marquee whitespace-nowrap">
              {[0, 1].map(i => (
                <div key={i} className="flex items-center space-x-6 mr-6 text-[10px] font-bold text-zinc-600 uppercase tracking-widest font-mono">
                  <span className="flex items-center space-x-2"><span className="w-1 h-1 rounded-full bg-tactical-500" /><span>12,400+ prompts forged</span></span>
                  <span className="flex items-center space-x-2"><span className="w-1 h-1 rounded-full bg-tactical-500" /><span>Avg improvement: +74 points</span></span>
                  <span className="flex items-center space-x-2"><span className="w-1 h-1 rounded-full bg-tactical-500" /><span>Used by developers, marketers & researchers</span></span>
                  <span className="flex items-center space-x-2"><span className="w-1 h-1 rounded-full bg-tactical-500" /><span>Works with ChatGPT, Claude, Gemini</span></span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Workbench Terminal ──────────────────────────────── */}
          <div className="relative group w-full">
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
                  className="w-full h-48 md:h-56 bg-transparent text-zinc-300 placeholder-zinc-700 focus:outline-none resize-none mono text-sm leading-7 px-6 pt-5 selection:bg-tactical-500/20"
                  placeholder="e.g. i need to study about node js..."
                  value={state.originalPrompt}
                  onChange={(e) => setState(prev => ({ ...prev, originalPrompt: e.target.value }))}
                />
              </div>

              {/* Try example link */}
              <div className="px-6 pb-3 -mt-1">
                <button
                  onClick={() => fillExample(EXAMPLE_PROMPT)}
                  className="text-[11px] font-bold text-tactical-500 hover:text-tactical-400 transition-colors"
                >
                  ✦ Try an example prompt →
                </button>
              </div>

              {/* Bottom bar: mode + forge */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-white/5 gap-3 bg-zinc-950/30">
                <div className="w-full sm:w-72 relative" ref={dropdownRef}>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex-1 h-10 bg-zinc-950/50 border border-white/10 rounded-lg px-4 flex items-center justify-between hover:border-tactical-500/30 transition-all"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{ModeIcons[state.mode]}</span>
                        <div className="text-left">
                          <div className="text-xs font-bold text-zinc-100">{state.mode}</div>
                          <div className="text-[8px] text-zinc-500 uppercase tracking-widest">Mode</div>
                        </div>
                      </div>
                      <svg className={`w-3.5 h-3.5 text-zinc-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {/* Tooltip icon */}
                    <div className="relative">
                      <button
                        onMouseEnter={() => setShowModeTooltip(true)}
                        onMouseLeave={() => setShowModeTooltip(false)}
                        className="w-6 h-6 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors flex-shrink-0"
                      >?</button>
                      {showModeTooltip && (
                        <div className="absolute bottom-full mb-2 right-0 w-56 p-3 bg-zinc-900 border border-white/10 rounded-lg shadow-xl text-[11px] text-zinc-400 leading-relaxed z-50">
                          Choose the context that best fits your prompt for more accurate optimization.
                        </div>
                      )}
                    </div>
                  </div>
                  {isDropdownOpen && (
                    <div className="absolute bottom-full mb-3 w-full bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
                      {Object.values(PromptMode).map(m => (
                        <button
                          key={m}
                          onClick={() => { setState(prev => ({ ...prev, mode: m })); setIsDropdownOpen(false); }}
                          className={`w-full px-5 py-3 text-left hover:bg-zinc-800 transition-colors border-b border-white/5 last:border-0 flex items-center space-x-3 ${state.mode === m ? 'bg-zinc-800/60' : ''}`}
                        >
                          <span className="text-base flex-shrink-0">{ModeIcons[m]}</span>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-zinc-100">{m}</div>
                            <div className="text-[9px] text-zinc-500 truncate">{ModeDetails[m]}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleForge}
                  disabled={state.isAnalyzing}
                  className="h-10 w-full sm:w-auto px-8 bg-gradient-to-r from-tactical-500 to-tactical-600 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-tactical-900/20 active:scale-95 disabled:opacity-50 disabled:shadow-none btn-sweep whitespace-nowrap flex items-center justify-center space-x-2"
                >
                  {state.isAnalyzing ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      <span>Forging...</span>
                    </>
                  ) : <span>Forge</span>}
                </button>
              </div>
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

          {state.error && (
            <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs font-bold text-center">
              {state.error}
            </div>
          )}

          {/* ── Results Dashboard ───────────────────────────────── */}
          {state.result && (
            <div id="results" className="mt-16 animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <ResultsDashboard
                result={state.result}
                originalPrompt={forgedOriginal}
                originalScore={originalScore}
              />
            </div>
          )}

          {/* ── Start from a Template (§7) ─────────────────────── */}
          <div className="mt-16 space-y-6">
            <div className="text-center">
              <h3 className="text-base font-black text-zinc-100 uppercase tracking-widest">Start from a Template</h3>
              <p className="text-zinc-600 text-xs mt-1">Click a card to auto-fill the prompt.</p>
            </div>
            <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x snap-mandatory">
              {TEMPLATE_CARDS.map((card) => (
                <button
                  key={card.label}
                  onClick={() => fillExample(card.prompt, card.mode)}
                  className="flex-shrink-0 w-44 snap-start group bg-[#111] border border-[#222] hover:border-tactical-500/40 rounded-xl p-5 text-left transition-all hover:bg-[#161616]"
                >
                  <span className="text-2xl block mb-3">{card.emoji}</span>
                  <span className="text-[10px] font-black text-tactical-500 uppercase tracking-widest">{card.label}</span>
                  <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed font-mono">"{card.prompt}"</p>
                </button>
              ))}
            </div>
          </div>

          {/* ── Your Forge History (§6 — localStorage) ─────────── */}
          <div className="mt-16 border-t border-white/5 pt-10 pb-12 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-zinc-100 uppercase tracking-widest">Your Forge History</h3>
                <p className="text-zinc-600 text-xs mt-1">Last 5 prompts stored locally.</p>
              </div>
            </div>

            {localHistory.length === 0 ? (
              <div className="text-center py-10 text-zinc-600 text-sm">
                No prompts forged yet. Start above ✦
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {localHistory.map((item) => (
                  <div key={item.id} className="group relative bg-[#111] border border-[#222] hover:border-tactical-500/30 rounded-xl p-5 transition-all hover:bg-[#161616]">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 text-[10px] font-bold font-mono">
                          <span className="text-zinc-600">{item.scoreBefore}</span>
                          <span className="text-zinc-700">→</span>
                          <span className="text-emerald-400">{item.scoreAfter}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold border border-emerald-500/20">
                          +{item.scoreAfter - item.scoreBefore}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-[10px] text-zinc-600 font-mono">{timeAgo(item.timestamp)}</span>
                        <button
                          onClick={() => fillExample(item.original)}
                          className="px-3 py-1 bg-zinc-800/50 hover:bg-tactical-500/20 border border-white/5 hover:border-tactical-500/30 rounded-md text-[9px] font-bold text-zinc-500 hover:text-tactical-400 uppercase tracking-wider transition-all"
                        >
                          Re-forge
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-500 font-mono truncate">{item.original.slice(0, 60)}{item.original.length > 60 ? '...' : ''}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}

export default function Page() {
  return <Workbench />;
}
