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
  const { user, isLoading } = useAuth(); // Global Auth State

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen selection:bg-tactical-500 selection:text-white relative overflow-hidden">
      {/* 3D Background — full neural network or minimal stars */}
      {variant === 'minimal' ? <StarsBackground /> : <NeuralBackground />}

      {/* Noise Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 brightness-100 mix-blend-overlay fixed pointer-events-none z-[2]"></div>

      <header className={`fixed top-0 inset-x-0 z-[100] transition-all duration-300 ${scrolled ? 'h-16 bg-[#05060a]/80 backdrop-blur-md border-b border-white/5 shadow-2xl shadow-tactical-900/5' : 'h-24 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
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
              // Loading Skeleton
              <div className="flex items-center space-x-4 animate-pulse">
                <div className="hidden sm:block space-y-2">
                  <div className="w-20 h-2 bg-white/10 rounded"></div>
                  <div className="w-12 h-1.5 bg-white/5 rounded ml-auto"></div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5"></div>
              </div>
            ) : user ? (
              // Authenticated View
              <UserMenu />
            ) : (
              // Guest View
              <button
                onClick={onSignInClick}
                className="h-10 px-6 bg-zinc-100 text-zinc-950 text-xs font-black rounded-lg hover:bg-white transition-all active:scale-95 shadow-xl uppercase tracking-widest"
              >
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