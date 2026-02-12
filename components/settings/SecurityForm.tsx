'use client';

import React, { useState } from 'react';
import { Lock, LogOut } from 'lucide-react';

export const SecurityForm: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLogoutLoading, setIsLogoutLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: "Passwords don't match" });
            return;
        }
        if (password.length < 6) {
            setMessage({ type: 'error', text: "Password must be at least 6 characters" });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/settings/security/email-otp/send', { method: 'POST' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setShowOtpInput(true);
            setMessage({ type: 'success', text: 'OTP sent to your email.' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/settings/security/password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password, otp }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setMessage({ type: 'success', text: 'Password updated successfully' });
            setPassword('');
            setConfirmPassword('');
            setOtp('');
            setShowOtpInput(false);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogoutAll = async () => {
        if (!confirm('Are you sure you want to log out of all other devices?')) return;

        setIsLogoutLoading(true);
        try {
            const res = await fetch('/api/settings/security/logout-all', { method: 'POST' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setMessage({ type: 'success', text: 'Successfully logged out of all other devices.' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsLogoutLoading(false);
        }
    };

    return (
        <div className="space-y-12">
            <div>
                <h2 className="text-2xl font-black text-white">Security</h2>
                <p className="text-zinc-500 text-sm mt-1">Manage your password and session security.</p>
            </div>

            <div className="max-w-lg space-y-8">
                <form onSubmit={showOtpInput ? handlePasswordUpdate : handleSendOtp} className="space-y-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <Lock className="w-4 h-4 text-tactical-500" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Change Password</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-tactical-500 focus:ring-1 focus:ring-tactical-500 transition-all font-mono"
                                placeholder="••••••••"
                                minLength={6}
                                disabled={showOtpInput}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-tactical-500 focus:ring-1 focus:ring-tactical-500 transition-all font-mono"
                                placeholder="••••••••"
                                minLength={6}
                                disabled={showOtpInput}
                            />
                        </div>

                        {showOtpInput && (
                            <div className="animate-in fade-in slide-in-from-top-2">
                                <label className="block text-xs font-bold text-tactical-500 uppercase tracking-wider mb-2">
                                    Email Verification Code
                                </label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full bg-zinc-950/50 border border-tactical-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-tactical-500 focus:ring-1 focus:ring-tactical-500 transition-all font-mono tracking-widest text-center"
                                    placeholder="Enter 6-digit OTP"
                                    maxLength={6}
                                    autoFocus
                                />
                                <p className="text-xs text-zinc-500 mt-2 text-center">
                                    Code sent to your email. Check console if testing.
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-6 py-3 bg-zinc-800 text-zinc-200 text-xs font-black rounded-xl hover:bg-zinc-700 transition-colors uppercase tracking-widest disabled:opacity-50"
                    >
                        {isLoading ? 'Processing...' : (showOtpInput ? 'Verify & Update' : 'Change Password')}
                    </button>

                    {showOtpInput && (
                        <button
                            type="button"
                            onClick={() => { setShowOtpInput(false); setOtp(''); }}
                            className="w-full text-xs text-zinc-500 hover:text-zinc-300 underline"
                        >
                            Cancel
                        </button>
                    )}
                </form>

                <div className="pt-8 border-t border-white/5">
                    <div className="flex items-center space-x-2 mb-4">
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Session Management</h3>
                    </div>

                    <p className="text-sm text-zinc-400 mb-6">
                        If you suspect your account is compromised, you can log out of all other devices immediately.
                    </p>

                    <button
                        onClick={handleLogoutAll}
                        disabled={isLogoutLoading}
                        className="px-6 py-3 border border-rose-500/30 bg-rose-500/5 text-rose-400 text-xs font-black rounded-xl hover:bg-rose-500/10 transition-colors uppercase tracking-widest"
                    >
                        {isLogoutLoading ? 'Processing...' : 'Log Out All Devices'}
                    </button>
                </div>

                {message && (
                    <div className={`p-4 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-bottom-2 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
};
