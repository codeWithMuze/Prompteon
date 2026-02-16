'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CinematicWrapperProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

export function CinematicWrapper({ children, delay = 0, className = '' }: CinematicWrapperProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
                duration: 0.8,
                delay,
                ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier for "cinematic" feel
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
