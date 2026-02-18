// lib/env.ts (MWIT-LINK Pattern)
// Priority: window.__ENV__ (Docker/Prod Runtime) > process.env (Local Dev)

interface Env {
  NEXT_PUBLIC_API_BASE_URL: string;
}

declare global {
  interface Window {
    __ENV__: Env;
  }
}

export const getEnv = (key: keyof Env): string => {
  if (typeof window !== "undefined" && window.__ENV__) {
    return window.__ENV__[key] || process.env[key] || "";
  }
  return process.env[key] || "";
};

export const API_BASE_URL = getEnv("NEXT_PUBLIC_API_BASE_URL");