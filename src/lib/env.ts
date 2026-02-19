// lib/env.ts (MWIT-LINK Pattern)
// Priority: window.__ENV__ (Docker/Prod Runtime) > process.env (Local Dev)

interface Env {
  NEXT_PUBLIC_API_BASE_URL: string;
  PROMPTPAY_ID: string;
}

declare global {
  interface Window {
    __ENV__: Env;
  }
}

export const getEnv = (key: keyof Env): string => {
  if (typeof window !== "undefined" && window.__ENV__) {
    return window.__ENV__[key] || process.env[key as string] || "";
  }
  return process.env[key as string] || "";
};

export const API_BASE_URL = getEnv("NEXT_PUBLIC_API_BASE_URL");
export const API_HOST = API_BASE_URL.replace(/\/api$/, "");
export const PROMPTPAY_ID = getEnv("PROMPTPAY_ID");