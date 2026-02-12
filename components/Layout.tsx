import React, { useState, useEffect } from 'react';
import { User, PromptHistoryItem } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  history: PromptHistoryItem[];
  onSignInClick: () => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, history, onSignInClick, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] selection:bg-tactical-500 selection:text-white relative">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-soft-light fixed pointer-events-none z-0"></div>

      <header className={`fixed top-0 inset-x-0 z-[100] transition-all duration-300 ${scrolled ? 'h-16 bg-zinc-950/80 backdrop-blur-md border-b border-white/5 shadow-2xl shadow-tactical-900/5' : 'h-24 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => window.location.reload()}>
            <div className="relative group/logo">
              <div className="absolute -inset-3 bg-tactical-500/20 blur-xl rounded-full opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500"></div>
              <div className="w-12 h-12 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-center shadow-2xl relative overflow-hidden group-hover/logo:border-tactical-500/50 transition-colors">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-50"></div>

                {/* Abstract 'P' Monolith */}
                <svg className="w-7 h-7 text-zinc-100 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0">
                  <path fill="currentColor" d="M16.5 4h-9A2.5 2.5 0 005 6.5v11A2.5 2.5 0 007.5 20h3a.5.5 0 00.5-.5v-5.5h3.5a5 5 0 005-5v-2.5a2.5 2.5 0 00-2.5-2.5zm-2 7.5H11V7h3.5a2.5 2.5 0 012.5 2.5v.5a1.5 1.5 0 01-1.5 1.5z" />
                  <path fill="#588157" d="M7 7h1v1H7zM7 10h1v1H7zM7 13h1v1H7z" className="group-hover/logo:animate-pulse" />
                </svg>

                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-4 h-4 bg-white/5 blur-sm rotate-45 translate-x-1.5 -translate-y-1.5"></div>
              </div>
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-xl font-black text-white tracking-tighter">Prompteon</span>
              <span className="text-[9px] font-black text-tactical-500 uppercase tracking-[0.3em]">Neural Engine</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-zinc-100 leading-none">{user.name}</p>
                  <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Active License</p>
                </div>
                <button onClick={onLogout} className="w-10 h-10 rounded-full border border-white/10 p-0.5 hover:border-emerald-500/50 transition-colors">
                  <img src={`https://ui-avatars.com/api/?name=${user.name}&background=09090b&color=fafafa`} className="w-full h-full rounded-full grayscale" alt="avatar" />
                </button>
              </div>
            ) : (
              <button onClick={onSignInClick} className="h-10 px-6 bg-zinc-100 text-zinc-950 text-xs font-black rounded-lg hover:bg-white transition-all active:scale-95 shadow-xl uppercase tracking-widest">
                Authorize
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="pt-32 pb-24 px-8 min-h-[calc(100vh-100px)]">
        {children}
      </main>

      <footer className="py-20 border-t border-white/5 bg-zinc-950/30">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-lg font-black text-white">Prompteon AI</span>
            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">© 2024 NEURAL_BRIDGE OPERATIONS</span>
          </div>
          <div className="flex space-x-8 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            <a href="#" className="hover:text-zinc-100 transition-colors">Status</a>
            <a href="#" className="hover:text-zinc-100 transition-colors">Documentation</a>
            <a href="#" className="hover:text-zinc-100 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div >
  );
};