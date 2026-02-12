'use client';

import React, { useState } from 'react';
import { useAuth } from '../AuthProvider';
import { User } from '../../types';
import { PhoneInputWrapper } from './PhoneInputWrapper';
import { Loader2, Send, CheckCircle2 } from 'lucide-react';

export const ProfileForm: React.FC = () => {

    const { user, login } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Countdown Timer logic
    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleSendOtp = async () => {
        if (!phone || phone.length < 8) {
            setMessage({ type: 'error', text: 'Please enter a valid phone number' });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/settings/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setIsOtpSent(true);
            setTimer(300); // 5 minutes
            setMessage({ type: 'success', text: 'OTP sent! Check server console (Mock).' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            setMessage({ type: 'error', text: 'Please enter a valid 6-digit OTP' });
            return;
        }

        setIsVerifying(true);
        setMessage(null);

        try {
            const res = await fetch('/api/settings/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, otp }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            // Update Auth State
            if (user) {
                login({ ...user, phone, phone_verified: true });
            }

            setIsOtpSent(false); // Hide OTP input
            setOtp('');
            setMessage({ type: 'success', text: 'Phone verified successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsVerifying(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/settings/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            // Update global auth state
            if (user) {
                login({ ...user, name, email, phone });
            }

            setMessage({ type: 'success', text: 'Profile updated successfully' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-black text-white">Profile Settings</h2>
                <p className="text-zinc-500 text-sm mt-1">Manage your public profile and contact details.</p>
            </div>

            <div className="flex items-center space-x-6 pb-8 border-b border-white/5">
                <div className="w-24 h-24 rounded-full border-2 border-white/10 p-1 relative group cursor-pointer">
                    <img
                        src={`https://ui-avatars.com/api/?name=${name || 'User'}&background=09090b&color=fafafa`}
                        alt="Avatar"
                        className="w-full h-full rounded-full grayscale hover:grayscale-0 transition-all duration-300"
                    />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">{name}</h3>
                    <p className="text-zinc-500 text-xs uppercase tracking-widest">{user?.plan} Plan</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-6 max-w-lg">
                    {/* Display Name */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Display Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-tactical-500 focus:ring-1 focus:ring-tactical-500 transition-all"
                            placeholder="Your Name"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-tactical-500 focus:ring-1 focus:ring-tactical-500 transition-all"
                            placeholder="your@email.com"
                        />
                    </div>

                    {/* Phone Verification Section */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                            Phone Number
                        </label>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <PhoneInputWrapper
                                    value={phone}
                                    onChange={setPhone}
                                    disabled={user?.phone_verified && !isOtpSent}
                                    verified={!!user?.phone_verified}
                                />
                            </div>
                            {!user?.phone_verified && !isOtpSent && (
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={isLoading || !phone}
                                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isLoading && <Loader2 size={16} className="animate-spin" />}
                                    {!isLoading && <Send size={16} />}
                                    <span className="text-xs font-bold uppercase tracking-wider">Send OTP</span>
                                </button>
                            )}
                            {user?.phone_verified && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (confirm('Are you sure you want to change your number? You will need to verify again.')) {
                                            // Logic to reset verification would go here (requires backend support or just overwriting)
                                            // For now, allow editing which resets verification on save/verify
                                            login({ ...user, phone_verified: false });
                                            setPhone('');
                                        }
                                    }}
                                    className="px-4 py-2 text-zinc-500 text-xs hover:text-white transition-colors uppercase tracking-wider font-bold"
                                >
                                    Change
                                </button>
                            )}
                        </div>

                        {/* OTP Input */}
                        {isOtpSent && (
                            <div className="mt-4 p-4 border border-white/10 rounded-xl bg-white/5 animate-in fade-in slide-in-from-top-2">
                                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                                    Enter OTP sent to {phone}
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-center text-lg tracking-[0.5em] font-mono text-white focus:outline-none focus:border-tactical-500 transition-all"
                                        placeholder="000000"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleVerifyOtp}
                                        disabled={isVerifying || otp.length !== 6}
                                        className="px-6 bg-tactical-500 text-black font-bold rounded-lg hover:bg-tactical-400 transition-colors disabled:opacity-50"
                                    >
                                        {isVerifying ? <Loader2 size={18} className="animate-spin" /> : 'Verify'}
                                    </button>
                                </div>
                                <div className="mt-2 flex justify-between items-center px-1">
                                    <span className="text-xs text-zinc-500">Expires in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
                                    <button
                                        type="button"
                                        disabled={timer > 0}
                                        onClick={handleSendOtp}
                                        className="text-xs text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Resend Code
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {message && (
                    <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                        {message.text}
                    </div>
                )}

                <div className="pt-4 border-t border-white/5">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 bg-white text-zinc-950 text-sm font-black rounded-xl hover:bg-zinc-200 transition-colors uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Saving Profile...' : 'Save Profile Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};
