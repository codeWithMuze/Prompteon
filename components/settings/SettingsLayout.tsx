'use client';

import React from 'react';
import { User, Shield, Sliders, Trash2 } from 'lucide-react';

interface SettingsLayoutProps {
    children: React.ReactNode;
    activeSection: 'profile' | 'security' | 'preferences' | 'account';
    onSectionChange: (section: 'profile' | 'security' | 'preferences' | 'account') => void;
}

export const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children, activeSection, onSectionChange }) => {
    const menuItems = [
        { id: 'profile', label: 'Profile Settings', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'preferences', label: 'Preferences', icon: Sliders },
        { id: 'account', label: 'Account', icon: Trash2, danger: true },
    ];

    return (
        <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 flex-shrink-0">
                <div className="sticky top-32 glass-panel rounded-2xl p-2 space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onSectionChange(item.id as any)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm group ${activeSection === item.id
                                    ? 'bg-white/10 text-white shadow-lg border border-white/5'
                                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
                                } ${item.danger ? 'hover:text-rose-400 hover:bg-rose-500/10' : ''}`}
                        >
                            <item.icon className={`w-4 h-4 transition-colors ${activeSection === item.id
                                    ? 'text-tactical-400'
                                    : item.danger ? 'text-rose-500/70 group-hover:text-rose-400' : 'text-zinc-600 group-hover:text-zinc-400'
                                }`} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1">
                <div className="glass-panel-heavy rounded-3xl p-8 min-h-[600px] animate-reveal">
                    {children}
                </div>
            </div>
        </div>
    );
};
