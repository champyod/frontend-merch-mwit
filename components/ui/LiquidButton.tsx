'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
}

export function LiquidButton({ 
  children, 
  variant = 'primary', 
  className, 
  onClick,
  ...props 
}: LiquidButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { id: Date.now(), x, y };
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 800);

    if (onClick) onClick(e);
  };

  const variants = {
    primary: "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border-emerald-500/30",
    outline: "bg-transparent border-white/20 hover:border-white/40 text-white",
    ghost: "bg-transparent border-transparent hover:bg-white/5 text-slate-400 hover:text-white",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative overflow-hidden rounded-xl border px-6 py-2.5 text-sm font-medium transition-all duration-300",
        "backdrop-blur-[20px]",
        variants[variant],
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.4 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'absolute',
              top: ripple.y,
              left: ripple.x,
              width: '20px',
              height: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              borderRadius: '50%',
              pointerEvents: 'none',
              translateX: '-50%',
              translateY: '-50%',
            }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  );
}
