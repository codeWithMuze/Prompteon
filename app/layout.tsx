import React from 'react';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PromptForge AI | Advanced Prompt Engineering Workbench',
  description: 'Elite-tier AI instruction forge and analytical suite for professional engineers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#09090b] text-[#fafafa] min-h-screen">
        {children}
      </body>
    </html>
  );
}