// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CapacitorProvider } from "@/components/capacitor-provider";

export const metadata: Metadata = {
  title: "EVENTually — Lagos Events & Venues",
  description:
    "Discover and book the best event venues, private beaches, restaurants, and clubs in Lagos, Nigeria.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "EVENTually",
  },
  // Open Graph
  openGraph: {
    title: "EVENTually",
    description: "Lagos Events & Venues, One Tap Away",
    type: "website",
    locale: "en_NG",
  },
  // Icons
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-icon-180.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  // Critical for Capacitor: allows the WebView content to extend
  // under the status bar and home indicator so we can apply
  // env(safe-area-inset-*) in CSS ourselves.
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,   // prevent accidental zoom (feels more native)
  userScalable: false,
  themeColor: "#0A0E1A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Capacitor Bridge — must be the FIRST script tag */}
        {/* On web this file doesn't exist and Next.js will silently skip it */}
        <script src="/cordova.js" async />

        {/* Prevent iOS from auto-detecting phone numbers and turning them into links */}
        <meta name="format-detection" content="telephone=no" />

        {/* Prevent iOS from adding tap highlights */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        {/*
          CapacitorProvider initializes plugins (StatusBar, SplashScreen, etc.)
          and adds the platform class to <body> for CSS targeting.
        */}
        <CapacitorProvider>
          {children}
        </CapacitorProvider>
      </body>
    </html>
  );
}
