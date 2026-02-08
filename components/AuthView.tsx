import React, { useState } from 'react';
import { AuthMode, User } from '../types';
import { supabase } from '../services/supabaseClient';

interface AuthViewProps {
  initialMode: AuthMode;
  onSuccess: (user: User) => void;
  onBack: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ initialMode, onSuccess, onBack }) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: email.split('@')[0],
              plan: 'free'
            }
          }
        });

        if (signUpError) throw signUpError;
        
        if (data.user) {
          onSuccess({
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata.name,
            plan: 'free'
          });
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) throw signInError;

        if (data.user) {
          onSuccess({
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata.name || email.split('@')[0],
            plan: data.user.user_metadata.plan || 'free',
            picture: data.user.user_metadata.avatar_url
          });
        }
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex items-center justify-center min-h-[70vh] px-4 py-8 animate-in fade-in duration-700">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 tool-bg tool-border rounded-[2.5rem] shadow-[0_80px_160px_rgba(0,0,0,0.7)] overflow-hidden ring-1 ring-white/10 relative">
        
        {/* Left Side: Branding & Visuals (Hidden on mobile) */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-zinc-900/40 border-r border-white/5 relative overflow-hidden">
          {/* Subtle Grid / Background elements */}
          <div className="absolute inset-0 grid-background opacity-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-zinc-950 to-transparent opacity-50 pointer-events-none" />
          
          <div className="relative z-10 space-y-12">
            <div className="flex items-center space-x-4">
               <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center shadow-xl">
                 <div className="w-5 h-5 bg-zinc-950 rounded-sm transform rotate-45" />
               </div>
               <div>
                 <h3 className="text-xl font-black text-white tracking-tight">Prompteon</h3>
                 <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">The Engine of Choice</p>
               </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl xl:text-5xl font-black text-zinc-100 leading-[1.1] tracking-tight">
                Unlock higher <br /> <span className="text-zinc-500">model performance.</span>
              </h2>
              <p className="text-zinc-400 text-lg font-medium leading-relaxed max-w-sm">
                Join 50,000+ engineers crafting elite-tier instructions with our architectural workbench.
              </p>
            </div>

            {/* Testimonial / Snippet Card */}
            <div className="p-6 bg-zinc-950/80 rounded-3xl border border-white/10 shadow-2xl space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500" />)}
                </div>
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Optimized Output v2.4</span>
              </div>
              <p className="text-sm font-mono text-zinc-300 leading-relaxed italic">
                "Task: Summarize technical doc... Parameters: Structure=JSON, Tone=Direct."
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center space-x-8 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">
             <span>Privacy First</span>
             <span>Daily Credits</span>
             <span>Cloud Secure</span>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="p-8 sm:p-12 md:p-16 lg:p-20 flex flex-col justify-center relative bg-zinc-950/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-100/[0.03] blur-[100px] rounded-full pointer-events-none" />
          
          <div className="max-w-md w-full mx-auto space-y-10 relative z-10">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl font-black text-zinc-100 tracking-tight">
                {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-zinc-500 font-bold text-[11px] uppercase tracking-[0.3em] mt-2">
                Forge your path with intelligence
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-[11px] font-bold">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-zinc-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="EMAIL ADDRESS" 
                    className="w-full h-14 bg-zinc-900/50 border border-white/5 rounded-2xl pl-14 pr-8 text-zinc-100 text-[12px] font-bold focus:outline-none focus:border-white/20 transition-all placeholder-zinc-700 uppercase tracking-widest"
                  />
                </div>

                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-zinc-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="SECRET KEY" 
                    className="w-full h-14 bg-zinc-900/50 border border-white/5 rounded-2xl pl-14 pr-14 text-zinc-100 text-[12px] font-bold focus:outline-none focus:border-white/20 transition-all placeholder-zinc-700 uppercase tracking-widest"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors p-1"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                    )}
                  </button>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-zinc-100 text-zinc-950 border border-white/10 rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-md flex items-center justify-center disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-[3px] border-zinc-950/20 border-t-zinc-950 rounded-full animate-spin" />
                  ) : (
                    mode === 'signin' ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </div>
            </form>

            <div className="pt-6 border-t border-white/5 flex flex-col items-center space-y-6">
              <p className="text-zinc-500 text-[12px] font-bold">
                {mode === 'signin' ? "Need a new license?" : "Already an engineer?"}{' '}
                <button 
                  onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                  className="text-zinc-100 hover:underline underline-offset-4"
                >
                  {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
              
              <button 
                onClick={onBack}
                className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] hover:text-zinc-400 transition-colors"
              >
                ← Return to Terminal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};