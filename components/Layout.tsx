import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { PromptHistoryItem } from '../types';
import { useAuth } from './AuthProvider';
import { UserMenu } from './UserMenu';
import { Logo } from './Logo';

const NeuralBackground = dynamic(
  () => import('./NeuralBackground').then(mod => mod.NeuralBackground),
  { ssr: false }
);

const StarsBackground = dynamic(
  () => import('./StarsBackground').then(mod => mod.StarsBackground),
  { ssr: false }
);

interface LayoutProps {
  children: React.ReactNode;
  history: PromptHistoryItem[];
  onSignInClick: () => void;
  variant?: 'default' | 'minimal';
}

export const Layout: React.FC<LayoutProps> = ({ children, history, onSignInClick, variant = 'default' }) => {
  const [scrolled, setScrolled] = useState(false);
  const [showReturnTop, setShowReturnTop] = useState(false);
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowReturnTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen selection:bg-tactical-500 selection:text-white relative overflow-hidden scroll-smooth">
      {/* 3D Background */}
      {variant === 'minimal' ? <StarsBackground /> : <NeuralBackground />}

      {/* Noise Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 brightness-100 mix-blend-overlay fixed pointer-events-none z-[2]"></div>

      {/* ── Header ────────────────────────────────────────────── */}
      <header className={`fixed top-0 inset-x-0 z-[100] transition-all duration-300 ${scrolled ? 'h-16 bg-[#05060a]/80 backdrop-blur-md border-b border-white/5 shadow-2xl shadow-tactical-900/5' : 'h-24 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-8 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group cursor-pointer">
            <Logo size="md" />
            <div className="flex flex-col -space-y-1">
              <span className="text-xl font-black text-white tracking-tighter hover:opacity-80 transition-opacity">Prompteon</span>
              <span className="text-[9px] font-black text-tactical-500 uppercase tracking-[0.3em]">Neural Engine</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-zinc-100 transition-colors">
              Home
            </Link>
            <Link href="/app" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-zinc-100 transition-colors">
              App
            </Link>
          </nav>

          <div className="flex items-center space-x-6">
            {isLoading ? (
              <div className="flex items-center space-x-4 animate-pulse">
                <div className="hidden sm:block space-y-2">
                  <div className="w-20 h-2 bg-white/10 rounded"></div>
                  <div className="w-12 h-1.5 bg-white/5 rounded ml-auto"></div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5"></div>
              </div>
            ) : user ? (
              <UserMenu />
            ) : (
              <button
                onClick={onSignInClick}
                className="h-10 px-5 md:px-6 bg-zinc-100 text-zinc-950 text-[10px] md:text-xs font-black rounded-lg hover:bg-white transition-all active:scale-95 shadow-xl uppercase tracking-widest"
              >
                Try Prompteon Free
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Main ──────────────────────────────────────────────── */}
      <main className="pt-32 pb-24 px-4 md:px-8 min-h-[calc(100vh-100px)]">
        {children}
      </main>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 bg-zinc-950/50 py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Left: Logo + tagline */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="flex items-center space-x-2">
              <Logo size="md" />
              <span className="text-lg font-black text-white">Prompteon AI</span>
            </div>
            <p className="text-[11px] text-zinc-600 font-medium">
              Turning rough ideas into precision prompts.
            </p>
            <span className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest mt-2">© 2024 Neural_Bridge Operations</span>
          </div>

          {/* Center: Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            <Link href="/" className="hover:text-zinc-100 transition-colors">Home</Link>
            <Link href="/app" className="hover:text-zinc-100 transition-colors">App</Link>
            <a href="#" className="hover:text-zinc-100 transition-colors">Changelog</a>
            <a href="#" className="hover:text-zinc-100 transition-colors">Documentation</a>
            <a href="#" className="hover:text-zinc-100 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-100 transition-colors">Status</a>
          </div>

          {/* Right: Newsletter signup */}
          <div className="flex flex-col items-center md:items-end space-y-3">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Stay Updated</span>
            <div className="flex w-full max-w-xs">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 h-10 px-4 bg-[#111] border border-[#222] border-r-0 rounded-l-lg text-xs text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-tactical-500/40 transition-colors font-mono"
              />
              <button className="h-10 px-5 bg-tactical-500 hover:bg-tactical-600 text-white text-[10px] font-black uppercase tracking-widest rounded-r-lg transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Floating Return to Top ────────────────────────────── */}
      {showReturnTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-zinc-900/80 border border-white/10 backdrop-blur-sm flex items-center justify-center text-zinc-500 hover:text-zinc-100 hover:border-tactical-500/40 transition-all shadow-xl hover:shadow-tactical-500/10 hover:-translate-y-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div >
  );
};