import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  // ── App Identity ────────────────────────────────────────────────────────────
  appId: "ng.eventually.app",
  appName: "EVENTually",

  // ── Web assets: Next.js static export goes to /out ─────────────────────────
  webDir: "out",

  // ── Server config ──────────────────────────────────────────────────────────
  server: {
    // Use https scheme so Supabase OAuth, Stripe, and fetch() work correctly
    // inside the Android/iOS WebView (avoids mixed-content and CORS issues)
    androidScheme: "https",
    iosScheme: "https",

    // Uncomment during local dev to point at your Next.js dev server:
    // url: "http://192.168.x.x:3000",
    // cleartext: true,
  },

  // ── Plugin configuration ───────────────────────────────────────────────────
  plugins: {
    // Splash Screen — shown while the WebView loads your app bundle
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#0A0E1A",   // EVENTually navy
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      iosSpinnerStyle: "small",
      spinnerColor: "#FF9500",      // EVENTually orange
      splashFullScreen: true,
      splashImmersive: true,
    },

    // Status Bar — Lagos nightlife dark look
    StatusBar: {
      style: "DARK",                // white icons on dark background
      backgroundColor: "#0A0E1A",
    },

    // Keyboard — prevent the WebView from resizing when keyboard appears
    Keyboard: {
      resize: "body",
      style: "DARK",
      resizeOnFullScreen: true,
    },
  },

  // ── Android-specific ───────────────────────────────────────────────────────
  android: {
    // Use bundled assets for offline/fast startup
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
    // Allow WebView to open external links in system browser
    // (needed for Stripe redirect, Google OAuth, etc.)
    allowNavigation: [
      "*.supabase.co",
      "*.stripe.com",
      "accounts.google.com",
      "*.paystack.com",
    ],
    // Prevent the WebView from being killed when app is backgrounded
    // (important for long Supabase auth sessions)
    overrideUserAgent: undefined,
    appendUserAgent: "EVENTually-Android",
    backgroundColor: "#0A0E1A",
    useLegacyBridge: false,
    // Min SDK 24 = Android 7.0, covers 98%+ of Nigerian Android market
    // (configured in android/variables.gradle, not here)
  },

  // ── iOS-specific ───────────────────────────────────────────────────────────
  ios: {
    appendUserAgent: "EVENTually-iOS",
    backgroundColor: "#0A0E1A",
    contentInset: "automatic",      // respect safe areas
    scrollEnabled: false,           // our app handles scroll internally
    limitsNavigationsToAppBoundDomains: true,
    allowNavigation: [
      "*.supabase.co",
      "*.stripe.com",
    ],
  },
};

export default config;
