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
    <div className="min-h-screen bg-[#09090b] selection:bg-emerald-500 selection:text-white">
      <header className={`fixed top-0 inset-x-0 z-[100] transition-all duration-300 ${scrolled ? 'h-16 bg-zinc-950/80 backdrop-blur-md border-b border-white/5' : 'h-24 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-4 h-4 bg-zinc-950 rounded-sm transform rotate-45" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-xl font-black text-white tracking-tighter">PromptForge</span>
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em]">Neural Engine</span>
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
            <span className="text-lg font-black text-white">PromptForge AI</span>
            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">© 2024 NEURAL_BRIDGE OPERATIONS</span>
          </div>
          <div className="flex space-x-8 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
             <a href="#" className="hover:text-zinc-100 transition-colors">Status</a>
             <a href="#" className="hover:text-zinc-100 transition-colors">Documentation</a>
             <a href="#" className="hover:text-zinc-100 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};