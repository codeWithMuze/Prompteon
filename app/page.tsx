'use client';

import React from 'react';
import Link from 'next/link';
import { Layout } from '../components/Layout';

const features = [
  {
    title: 'Prompt Optimization',
    description: 'Automatically refine and restructure your prompts for maximum clarity, precision, and AI comprehension.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: 'AI Suggestions',
    description: 'Get intelligent, context-aware suggestions to enhance your prompt engineering workflow in real time.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'Prompt Library',
    description: 'Access a curated collection of battle-tested prompt templates across categories and use cases.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    title: 'Real-time Feedback',
    description: 'Receive instant scoring and detailed analysis metrics on clarity, specificity, and task alignment.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

const steps = [
  {
    step: '01',
    title: 'Enter Your Prompt',
    description: 'Paste or type your raw prompt into the Neural Forge workbench terminal.',
  },
  {
    step: '02',
    title: 'AI Improves It',
    description: 'Our engine analyzes structure, clarity, and intent — then architecturally refines your prompt.',
  },
  {
    step: '03',
    title: 'Get Better Results',
    description: 'Use the optimized prompt to unlock dramatically improved AI outputs across any model.',
  },
];

export default function LandingPage() {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Layout history={[]} onSignInClick={() => {}}>
      {/* ── Hero Section ───────────────────────────────────────────── */}
      <section className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <div className="animate-reveal space-y-6">
          <div className="inline-flex items-center space-x-2.5 px-4 py-2 bg-zinc-900/40 backdrop-blur-md border border-tactical-500/20 rounded-full shadow-lg shadow-tactical-900/10 hover:border-tactical-500/40 hover:bg-zinc-900/60 transition-all duration-300 group cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tactical-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-tactical-500 shadow-[0_0_10px_#588157]"></span>
            </span>
            <span className="text-[10px] md:text-[11px] font-bold text-zinc-400 tracking-[0.2em] uppercase group-hover:text-zinc-200 transition-colors">
              Neural <span className="text-tactical-300">Forge</span> <span className="text-tactical-400 drop-shadow-[0_0_8px_rgba(88,129,87,0.5)]">Online</span>
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-zinc-100 tracking-tighter leading-[0.9]">
            Supercharge Your AI <br />
            <span className="text-gradient">Prompts with Prompteon</span>
          </h1>

          <p className="text-zinc-400 text-sm md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Create, refine, and manage high-quality prompts effortlessly.
            Transform raw instructions into architectural-grade AI inputs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/app"
              className="h-12 px-10 bg-gradient-to-r from-tactical-500 to-tactical-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-tactical-900/20 active:scale-95 btn-sweep inline-flex items-center justify-center"
            >
              Start Now
            </Link>
            <button
              onClick={scrollToFeatures}
              className="h-12 px-10 bg-zinc-900/50 border border-white/10 text-zinc-300 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-800/60 hover:border-tactical-500/30 transition-all active:scale-95 inline-flex items-center justify-center gap-2"
            >
              View Features
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── Features Section ───────────────────────────────────────── */}
      <section id="features" className="w-full max-w-6xl mx-auto py-24 md:py-32">
        <div className="text-center mb-16 space-y-4">
          <span className="text-[10px] font-black text-tactical-500 uppercase tracking-[0.3em]">
            Core Capabilities
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-zinc-100 tracking-tighter">
            Built for <span className="text-gradient">Precision</span>
          </h2>
          <p className="text-zinc-500 text-sm md:text-base max-w-xl mx-auto">
            Every feature is engineered to elevate your prompt engineering workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card rounded-2xl p-8 group cursor-default"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-tactical-500/10 border border-tactical-500/20 flex items-center justify-center text-tactical-400 mb-6 group-hover:bg-tactical-500/20 group-hover:border-tactical-500/40 transition-all">
                {feature.icon}
              </div>
              <h3 className="text-lg font-black text-zinc-100 mb-3 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works Section ───────────────────────────────────── */}
      <section className="w-full max-w-6xl mx-auto py-24 md:py-32 border-t border-white/5">
        <div className="text-center mb-16 space-y-4">
          <span className="text-[10px] font-black text-tactical-500 uppercase tracking-[0.3em]">
            Workflow
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-zinc-100 tracking-tighter">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-zinc-500 text-sm md:text-base max-w-xl mx-auto">
            Three steps from raw input to architectural-grade output.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-tactical-500/30 to-transparent z-0" />
              )}
              <div className="glass-panel rounded-2xl p-8 relative z-10">
                <div className="text-5xl font-black text-tactical-500/20 mb-4 leading-none">
                  {item.step}
                </div>
                <h3 className="text-lg font-black text-zinc-100 mb-3 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Section ────────────────────────────────────────────── */}
      <section className="w-full max-w-4xl mx-auto py-24 md:py-32">
        <div className="glass-panel-heavy rounded-[2rem] p-12 md:p-16 text-center relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(88,129,87,0.1)_0%,_transparent_70%)]" />

          <div className="relative z-10 space-y-8">
            <h2 className="text-3xl md:text-4xl font-black text-zinc-100 tracking-tighter">
              Start improving your <br />
              <span className="text-gradient">prompts today</span>
            </h2>
            <p className="text-zinc-500 text-sm md:text-base max-w-md mx-auto">
              Join the Neural Forge and transform the way you communicate with AI.
            </p>
            <Link
              href="/app"
              className="h-12 px-12 bg-gradient-to-r from-tactical-500 to-tactical-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-tactical-900/20 active:scale-95 btn-sweep inline-flex items-center justify-center"
            >
              Launch Workbench
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}