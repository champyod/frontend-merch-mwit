"use client";

import React, { forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BaseProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  id?: string;
}

// --- Layout Primitives ---

export const Box = ({ 
  children, 
  className, 
  as: Component = "div",
  ...props 
}: BaseProps & { as?: any } & React.AllHTMLAttributes<HTMLElement>) => (
  <Component className={cn(className)} {...props}>
    {children}
  </Component>
);

export const Stack = ({ 
  children, 
  className, 
  gap = 4, 
  alignItems,
  justifyContent,
  as: Component = "div",
  ...props 
}: BaseProps & { 
  gap?: number;
  alignItems?: "start" | "center" | "end" | "baseline" | "stretch";
  justifyContent?: "start" | "center" | "end" | "between" | "around" | "evenly";
  as?: any;
} & React.AllHTMLAttributes<HTMLElement>) => {
  const alignMap = { start: "items-start", center: "items-center", end: "items-end", baseline: "items-baseline", stretch: "items-stretch" };
  const justifyMap = { start: "justify-start", center: "justify-center", end: "justify-end", between: "justify-between", around: "justify-around", evenly: "justify-evenly" };

  return (
    <Component 
      className={cn(
        "flex flex-col", 
        `gap-${gap}`, 
        alignItems && alignMap[alignItems],
        justifyContent && justifyMap[justifyContent],
        className
      )} 
      {...props}
    >
      {children}
    </Component>
  );
};

export const Flex = ({ 
  children, 
  className, 
  gap = 4, 
  alignItems = "center", 
  justifyContent,
  direction = "row",
  wrap = "nowrap",
  as: Component = "div",
  ...props 
}: BaseProps & { 
  gap?: number | { initial: number; md?: number; lg?: number }; 
  alignItems?: "start" | "center" | "end" | "baseline" | "stretch";
  justifyContent?: "start" | "center" | "end" | "between" | "around" | "evenly";
  direction?: "row" | "col" | "row-reverse" | "col-reverse";
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
  as?: any;
} & React.AllHTMLAttributes<HTMLElement>) => {
  const alignMap = { start: "items-start", center: "items-center", end: "items-end", baseline: "items-baseline", stretch: "items-stretch" };
  const justifyMap = { start: "justify-start", center: "justify-center", end: "justify-end", between: "justify-between", around: "justify-around", evenly: "justify-evenly" };
  const dirMap = { row: "flex-row", col: "flex-col", "row-reverse": "flex-row-reverse", "col-reverse": "flex-col-reverse" };
  const wrapMap = { nowrap: "flex-nowrap", wrap: "flex-wrap", "wrap-reverse": "flex-wrap-reverse" };
  
  // Handle responsive gap
  const gapClass = typeof gap === "number" 
    ? `gap-${gap}` 
    : cn(`gap-${gap.initial}`, gap.md && `md:gap-${gap.md}`, gap.lg && `lg:gap-${gap.lg}`);

  return (
    <Component 
      className={cn(
        "flex", 
        gapClass, 
        alignMap[alignItems], 
        justifyContent && justifyMap[justifyContent],
        dirMap[direction],
        wrapMap[wrap],
        className
      )} 
      {...props}
    >
      {children}
    </Component>
  );
};

export const Grid = ({ 
  children, 
  className, 
  cols = 1, 
  gap = 4,
  as: Component = "div",
  ...props 
}: BaseProps & { 
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: number;
  as?: any;
} & React.AllHTMLAttributes<HTMLElement>) => {
  const colsMap = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4", 5: "grid-cols-5", 6: "grid-cols-6", 12: "grid-cols-12" };
  return (
    <Component className={cn("grid", colsMap[cols], `gap-${gap}`, className)} {...props}>
      {children}
    </Component>
  );
};

export const Container = ({ children, className, maxWidth = "4xl", as: Component = "div", ...props }: BaseProps & { maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full", as?: any } & React.AllHTMLAttributes<HTMLElement>) => {
  const maxMap = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", xl: "max-w-xl", "2xl": "max-w-2xl", "3xl": "max-w-3xl", "4xl": "max-w-4xl", "5xl": "max-w-5xl", "6xl": "max-w-6xl", "7xl": "max-w-7xl", full: "max-w-full" };
  return (
    <Component className={cn("container mx-auto px-4", maxMap[maxWidth], className)} {...props}>
      {children}
    </Component>
  );
};

// --- Typography Primitives ---

export const Text = ({ 
  children, 
  className, 
  size = "md", 
  weight = "normal", 
  color,
  uppercase,
  italic,
  tracking,
  align,
  ...props 
}: BaseProps & { 
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  weight?: "normal" | "medium" | "bold" | "black";
  color?: string;
  uppercase?: boolean;
  italic?: boolean;
  tracking?: "tight" | "normal" | "wide" | "widest";
  align?: "left" | "center" | "right";
}) => {
  const sizeMap = { 
    xs: "text-xs", sm: "text-sm", md: "text-base", lg: "text-lg", xl: "text-xl", 
    "2xl": "text-2xl", "3xl": "text-3xl", "4xl": "text-4xl" 
  };
  const weightMap = { normal: "font-normal", medium: "font-medium", bold: "font-bold", black: "font-black" };
  const trackingMap = { tight: "tracking-tighter", normal: "tracking-normal", wide: "tracking-wide", widest: "tracking-widest" };
  const alignMap = { left: "text-left", center: "text-center", right: "text-right" };

  return (
    <span 
      className={cn(
        sizeMap[size], 
        weightMap[weight], 
        color, 
        uppercase && "uppercase", 
        italic && "italic",
        tracking && trackingMap[tracking],
        align && alignMap[align],
        className
      )} 
      {...props}
    >
      {children}
    </span>
  );
};

export const Heading = ({ 
  children, 
  className, 
  level = 1, 
  size,
  color,
  weight = "bold",
  align,
  uppercase,
  tracking,
  ...props 
}: BaseProps & { 
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  color?: string;
  weight?: "normal" | "medium" | "bold" | "extrabold" | "black";
  align?: "left" | "center" | "right";
  uppercase?: boolean;
  tracking?: "tight" | "normal" | "wide" | "widest";
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const sizeMap = { 
    sm: "text-sm", md: "text-base", lg: "text-lg", xl: "text-xl", 
    "2xl": "text-2xl", "3xl": "text-3xl", "4xl": "text-4xl" 
  };
  const weightMap = { normal: "font-normal", medium: "font-medium", bold: "font-bold", extrabold: "font-extrabold", black: "font-black" };
  const alignMap = { left: "text-left", center: "text-center", right: "text-right" };
  const trackingMap = { tight: "tracking-tighter", normal: "tracking-normal", wide: "tracking-wide", widest: "tracking-widest" };
  
  return (
    <Tag 
      className={cn(
        weightMap[weight], 
        size && sizeMap[size], 
        color,
        align && alignMap[align],
        uppercase && "uppercase",
        tracking && trackingMap[tracking],
        className
      )} 
      {...props}
    >
      {children}
    </Tag>
  );
};

// --- Action Primitives ---

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "liquid";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ 
  children, 
  className, 
  variant = "primary", 
  size = "md", 
  isLoading, 
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-[#217c6b] to-[#58a076] text-white hover:shadow-[0_0_20px_rgba(88,160,118,0.4)] hover:scale-[1.02]",
    liquid: "relative overflow-hidden bg-[#217c6b] text-white hover:bg-[#58a076] shadow-[0_0_15px_rgba(33,124,107,0.5)]", // Simplified liquid for standardization
    secondary: "bg-white/10 text-white hover:bg-white/20",
    outline: "border-2 border-white/10 bg-transparent text-white hover:bg-white/5",
    ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20",
  };
  
  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-6 py-2.5 gap-2",
    lg: "text-base px-8 py-3.5 gap-3",
    icon: "h-10 w-10 p-2",
  };

  return (
    <button 
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
      {children}
    </button>
  );
});
Button.displayName = "Button";

// --- Input Primitives ---

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, error, id, ...props }, ref) => (
  <Stack gap={2} className="w-full">
    {label && <label htmlFor={id} className="text-sm font-medium text-slate-400">{label}</label>}
    <input
      id={id}
      ref={ref}
      className={cn(
        "w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#58a076]/50 transition-all placeholder:text-slate-600",
        error && "border-red-500 focus:ring-red-500/50",
        className
      )}
      {...props}
    />
    {error && <Text size="xs" color="text-red-500">{error}</Text>}
  </Stack>
));
Input.displayName = "Input";

export const TextArea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string, error?: string }>(({ className, label, error, id, ...props }, ref) => (
  <Stack gap={2} className="w-full">
    {label && <label htmlFor={id} className="text-sm font-medium text-slate-400">{label}</label>}
    <textarea
      id={id}
      ref={ref}
      className={cn(
        "w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#58a076]/50 transition-all placeholder:text-slate-600 min-h-[100px]",
        error && "border-red-500 focus:ring-red-500/50",
        className
      )}
      {...props}
    />
    {error && <Text size="xs" color="text-red-500">{error}</Text>}
  </Stack>
));
TextArea.displayName = "TextArea";

// --- Display Primitives ---

export const Card = ({ children, className, variant = "glass", ...props }: BaseProps & { variant?: "glass" | "solid" | "outline" }) => {
  const variants = {
    glass: "bg-white/5 border border-white/10 backdrop-blur-sm",
    solid: "bg-[#0a2735] border border-white/5",
    outline: "bg-transparent border border-white/10",
  };

  return (
    <div className={cn("rounded-3xl", variants[variant], className)} {...props}>
      {children}
    </div>
  );
};

export const Badge = ({ children, className, variant = "default" }: BaseProps & { variant?: "default" | "success" | "warning" | "info" | "danger" }) => {
  const variants = {
    default: "bg-white/10 text-white/60",
    success: "bg-[#58a076]/20 text-[#58a076]",
    warning: "bg-yellow-500/20 text-yellow-500",
    info: "bg-blue-500/20 text-blue-500",
    danger: "bg-red-500/20 text-red-500",
  };

  return (
    <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", variants[variant], className)}>
      {children}
    </span>
  );
};