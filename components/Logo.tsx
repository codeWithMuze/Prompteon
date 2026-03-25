import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  className = '',
  animate = true
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-12 h-12 rounded-2xl',
    lg: 'w-16 h-16 rounded-[24px]',
    xl: 'w-24 h-24 rounded-[32px]'
  };

  const iconClasses = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14'
  };

  const accentClasses = {
    sm: 'w-3 h-3 translate-x-1 -translate-y-1',
    md: 'w-4 h-4 translate-x-1.5 -translate-y-1.5',
    lg: 'w-6 h-6 translate-x-2 -translate-y-2',
    xl: 'w-8 h-8 translate-x-3 -translate-y-3'
  };

  const containerSize = sizeClasses[size];
  const iconSize = iconClasses[size];
  const accentSize = accentClasses[size];

  return (
    <div className={`relative group/logo ${className}`}>
      {/* Glow effect */}
      <div className={`absolute -inset-3 bg-tactical-500/20 blur-xl rounded-full opacity-0 ${animate ? 'group-hover/logo:opacity-100' : ''} transition-opacity duration-500`}></div>

      {/* Box */}
      <div className={`${containerSize} bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-2xl relative overflow-hidden ${animate ? 'group-hover/logo:border-tactical-500/50' : ''} transition-colors`}>
        {/* Subtle inner gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-50"></div>

        {/* Abstract 'P' Monolith */}
        <svg className={`${iconSize} text-zinc-100 relative z-10`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0">
          <path fill="currentColor" d="M16.5 4h-9A2.5 2.5 0 005 6.5v11A2.5 2.5 0 007.5 20h3a.5.5 0 00.5-.5v-5.5h3.5a5 5 0 005-5v-2.5a2.5 2.5 0 00-2.5-2.5zm-2 7.5H11V7h3.5a2.5 2.5 0 012.5 2.5v.5a1.5 1.5 0 01-1.5 1.5z" />
          <path fill="#588157" d="M7 7h1v1H7zM7 13h1v1H7z" className={animate ? 'group-hover/logo:animate-pulse' : ''} />
          {/* Middle dot without pulse to ensure core stability of aesthetic */}
          <path fill="#588157" d="M7 10h1v1H7z" />
        </svg>

        {/* Corner Accent */}
        <div className={`absolute top-0 right-0 ${accentSize} bg-white/5 blur-sm rotate-45`}></div>
      </div>
    </div>
  );
};

