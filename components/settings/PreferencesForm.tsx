'use client';

import React, { useState } from 'react';
import { useAuth } from '../AuthProvider';

export const PreferencesForm: React.FC = () => {
    const { user, login } = useAuth();
    const [theme, setTheme] = useState(user?.preferences?.theme || 'dark');
    const [model, setModel] = useState(user?.preferences?.model || 'gpt-4');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        const preferences = { theme, model };

        try {
            const res = await fetch('/api/settings/preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(preferences),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            if (user) {
                login({ ...user, preferences: { ...user.preferences, ...preferences } });
            }

            setMessage({ type: 'success', text: 'Preferences saved' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-black text-white">Preferences</h2>
                <p className="text-zinc-500 text-sm mt-1">Customize your Prompteon experience.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 max-w-lg">


                <div className="space-y-4">
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Default AI Model</label>
                    <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-tactical-500 focus:ring-1 focus:ring-tactical-500 transition-all appearance-none"
                    >
                        <option value="gpt-4">GPT-4 Turbo (Recommended)</option>
                        <option value="gpt-3.5">GPT-3.5 Fast</option>
                        <option value="claude-3">Claude 3 Opus</option>
                    </select>
                </div>

                {message && (
                    <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                        {message.text}
                    </div>
                )}

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 bg-white text-zinc-950 text-sm font-black rounded-xl hover:bg-zinc-200 transition-colors uppercase tracking-widest disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : 'Save Preferences'}
                    </button>
                </div>
            </form>
        </div>
    );
};
