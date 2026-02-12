'use client';

import React, { useState } from 'react';
import { useAuth } from '../AuthProvider';
import { AlertTriangle } from 'lucide-react';

export const DeleteAccount: React.FC = () => {
    const { logout } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    const handleDelete = async () => {
        if (!confirmed) return;

        setIsLoading(true);
        try {
            const res = await fetch('/api/settings/account', { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete account');

            await logout();
        } catch (error) {
            alert('Failed to delete account. Please try again or contact support.');
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-black text-rose-500">Danger Zone</h2>
                <p className="text-zinc-500 text-sm mt-1">Irreversible account actions.</p>
            </div>

            <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6">
                <div className="flex items-start space-x-4">
                    <div className="p-3 bg-rose-500/10 rounded-xl">
                        <AlertTriangle className="w-6 h-6 text-rose-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">Delete Account</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                            This action is permanent and cannot be undone. All your prompts, history, and personal data will be immediately erased from our servers.
                        </p>

                        <div className="space-y-4">
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={confirmed}
                                    onChange={(e) => setConfirmed(e.target.checked)}
                                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-rose-500 focus:ring-rose-500/50"
                                />
                                <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                                    I understand this action is irreversible
                                </span>
                            </label>

                            <button
                                onClick={handleDelete}
                                disabled={!confirmed || isLoading}
                                className="px-6 py-3 bg-rose-600 text-white text-xs font-black rounded-xl hover:bg-rose-700 transition-colors uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-rose-900/20"
                            >
                                {isLoading ? 'Deleting Account...' : 'Permanently Delete Account'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
