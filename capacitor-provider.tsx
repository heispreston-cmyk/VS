// components/capacitor-provider.tsx
"use client";

import { useEffect } from "react";
import { useCapacitor } from "@/hooks/use-capacitor";

/**
 * Thin wrapper that runs the useCapacitor hook (which initializes
 * StatusBar, SplashScreen, Keyboard, back-button, etc.).
 *
 * Rendered inside <body> in layout.tsx so it always runs,
 * even before any page-level code.
 */
export function CapacitorProvider({ children }: { children: React.ReactNode }) {
  useCapacitor();
  return <>{children}</>;
}
