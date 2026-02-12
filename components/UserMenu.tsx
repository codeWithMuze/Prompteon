'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { User, Settings, LogOut, CreditCard, ChevronDown } from 'lucide-react';

export const UserMenu: React.FC = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await logout();
    };

    if (!user) return null;

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-3 p-1.5 pl-3 pr-2 rounded-full border border-white/5 bg-zinc-900/40 hover:bg-zinc-800/60 hover:border-white/10 transition-all duration-300 group"
            >
                <div className="text-right hidden sm:block">
                    <p className="text-xs font-black text-zinc-100 leading-none group-hover:text-white transition-colors">{user.name}</p>
                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-zinc-400 transition-colors">
                        {user.plan === 'pro' ? 'Pro License' : 'Free Tier'}
                    </p>
                </div>

                <div className="relative">
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 group-hover:border-tactical-500/50 transition-colors">
                        <img
                            src={`https://ui-avatars.com/api/?name=${user.name}&background=09090b&color=fafafa`}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            alt="avatar"
                        />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-zinc-950 rounded-full flex items-center justify-center">
                        <div className={`w-2 h-2 rounded-full ${user.plan === 'pro' ? 'bg-emerald-500' : 'bg-zinc-500'} border border-zinc-950`} />
                    </div>
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-3 w-64 glass-panel-heavy rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Signed in as</p>
                        <p className="text-sm font-black text-white truncate">{user.email}</p>
                    </div>

                    <div className="p-2 space-y-0.5">
                        <button
                            onClick={() => { setIsOpen(false); router.push('/settings'); }}
                            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/5 transition-colors group"
                        >
                            <User className="w-4 h-4 text-zinc-500 group-hover:text-tactical-400 transition-colors" />
                            <span>Profile</span>
                        </button>
                        <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/5 transition-colors group">
                            <CreditCard className="w-4 h-4 text-zinc-500 group-hover:text-tactical-400 transition-colors" />
                            <span>Subscription</span>
                        </button>
                        <button
                            onClick={() => { setIsOpen(false); router.push('/settings'); }}
                            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/5 transition-colors group"
                        >
                            <Settings className="w-4 h-4 text-zinc-500 group-hover:text-tactical-400 transition-colors" />
                            <span>Settings</span>
                        </button>
                    </div>

                    <div className="p-2 border-t border-white/5">
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors group"
                        >
                            {isLoggingOut ? (
                                <div className="w-4 h-4 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
                            ) : (
                                <LogOut className="w-4 h-4 text-rose-500/70 group-hover:text-rose-400 transition-colors" />
                            )}
                            <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
