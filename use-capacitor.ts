// hooks/use-capacitor.ts
// Initializes Capacitor plugins when running as a native app.
// Safe to import on web too — all calls are no-ops in browser.

"use client";

import { useEffect, useState } from "react";

interface CapacitorInfo {
  isNative: boolean;
  platform: "ios" | "android" | "web";
  isAndroid: boolean;
  isIOS: boolean;
}

export function useCapacitor(): CapacitorInfo {
  const [info, setInfo] = useState<CapacitorInfo>({
    isNative: false,
    platform: "web",
    isAndroid: false,
    isIOS: false,
  });

  useEffect(() => {
    (async () => {
      try {
        // Dynamically import Capacitor core so the web build isn't affected
        const { Capacitor } = await import("@capacitor/core");

        const platform = Capacitor.getPlatform() as "ios" | "android" | "web";
        const isNative = Capacitor.isNativePlatform();

        setInfo({
          isNative,
          platform,
          isAndroid: platform === "android",
          isIOS: platform === "ios",
        });

        // Add platform class to <body> for CSS targeting
        if (isNative) {
          document.body.classList.add(`capacitor-${platform}`);
        }

        // ── Status Bar ───────────────────────────────────────────────────────
        if (isNative) {
          const { StatusBar, Style } = await import("@capacitor/status-bar");
          await StatusBar.setStyle({ style: Style.Dark });
          // EVENTually navy background for the status bar
          await StatusBar.setBackgroundColor({ color: "#0A0E1A" });
          await StatusBar.setOverlaysWebView({ overlay: false });
        }

        // ── Splash Screen ────────────────────────────────────────────────────
        if (isNative) {
          const { SplashScreen } = await import("@capacitor/splash-screen");
          // Wait a moment for the app to render before hiding
          setTimeout(async () => {
            await SplashScreen.hide({ fadeOutDuration: 400 });
          }, 300);
        }

        // ── Keyboard ─────────────────────────────────────────────────────────
        if (isNative) {
          const { Keyboard } = await import("@capacitor/keyboard");
          // Scroll the WebView content to keep focused input visible
          Keyboard.addListener("keyboardWillShow", (info) => {
            document.documentElement.style.setProperty(
              "--keyboard-height",
              `${info.keyboardHeight}px`
            );
          });
          Keyboard.addListener("keyboardWillHide", () => {
            document.documentElement.style.setProperty(
              "--keyboard-height",
              "0px"
            );
          });
        }

        // ── App (hardware back button on Android) ────────────────────────────
        if (platform === "android") {
          const { App } = await import("@capacitor/app");
          App.addListener("backButton", ({ canGoBack }) => {
            if (canGoBack) {
              window.history.back();
            } else {
              App.exitApp();
            }
          });
        }
      } catch (err) {
        // Not a native environment or Capacitor not installed — safe to ignore
        if (process.env.NODE_ENV === "development") {
          console.log("[useCapacitor] Running in web mode:", err);
        }
      }
    })();
  }, []);

  return info;
}
