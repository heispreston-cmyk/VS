# EVENTually — Native Mobile Build Guide
### Capacitor 6 + Next.js 15 → Android (.apk / .aab) + iOS (.ipa)

---

## Overview

```
Next.js 15 (App Router)
       ↓ next build (output: 'export')
   /out directory  (static HTML/CSS/JS)
       ↓ cap sync
   Android Studio / Xcode
       ↓ build
 .apk / .aab / .ipa
```

---

## Files Changed / Added

Copy these files over your existing project:

| File | Action |
|------|--------|
| `next.config.ts` | Updated — adds `output: 'export'`, `trailingSlash`, `images.unoptimized` |
| `package.json` | Updated — Capacitor deps + mobile scripts |
| `capacitor.config.ts` | New — Capacitor configuration |
| `app/globals.css` | Updated — safe-area insets, WebView optimizations |
| `app/layout.tsx` | Updated — viewport meta, PWA, CapacitorProvider |
| `components/capacitor-provider.tsx` | New — initializes native plugins |
| `hooks/use-capacitor.ts` | New — StatusBar, SplashScreen, Keyboard, back button |
| `public/manifest.json` | Updated — full PWA manifest |
| `android/variables.gradle` | New (after cap add android) — Android SDK versions |

---

## Step 1 — Install Dependencies

```bash
npm install
```

This installs:
- `@capacitor/core` `@capacitor/cli` `@capacitor/android` `@capacitor/ios`
- `@capacitor/status-bar` `@capacitor/splash-screen` `@capacitor/keyboard`
- `@capacitor/app` `@capacitor/haptics` `@capacitor/browser`

---

## Step 2 — Static Export Build

```bash
npm run build
```

This runs `next build` which, because of `output: 'export'` in `next.config.ts`,
generates a fully static site into the `out/` folder.

✅ Verify: `ls out/` should show `index.html`, `_next/`, and your page folders.

⚠️ **Things that stop working in static export:**
- Server Actions (`"use server"` functions) — move logic to client-side Supabase calls
- API Routes (`/api/*`) — Supabase is called directly from the client; Stripe webhook
  needs a separate serverless function (Vercel/Netlify function, or keep web deploy
  for webhooks while the app talks to Supabase directly)
- `next/image` optimization server — replaced by `unoptimized: true`

✅ **Things that keep working:**
- Supabase JS client (auth, database, realtime, storage)
- Leaflet maps
- Stripe.js (client-side checkout / redirect)
- All UI, animations, state

---

## Step 3 — Initialize Capacitor (first time only)

```bash
npx cap init "EVENTually" "ng.eventually.app" --web-dir out
```

This creates the Capacitor config. But since you already have `capacitor.config.ts`,
you can skip this and go straight to Step 4.

---

## Step 4 — Add Platforms (first time only)

### Android
```bash
npx cap add android
```

### iOS (requires macOS + Xcode 15+)
```bash
npx cap add ios
```

---

## Step 5 — Sync Web Assets to Native Projects

```bash
npx cap sync
```

Run this every time you rebuild the Next.js app. It:
1. Copies `out/` → `android/app/src/main/assets/public/`
2. Updates native plugins
3. Updates CocoaPods (iOS)

Or use the all-in-one script:
```bash
npm run mobile:sync
```

---

## Step 6A — Build & Run on Android

### Prerequisites
- [Android Studio](https://developer.android.com/studio) installed
- Android SDK 35 installed (via Android Studio SDK Manager)
- `ANDROID_HOME` environment variable set

### Open in Android Studio
```bash
npx cap open android
# OR
npm run cap:android
```

### In Android Studio:
1. Wait for Gradle sync to finish (~2 min first time)
2. Select your device / emulator
3. Click ▶ Run

### Generate Release APK (for sideloading / testing)
```
Build → Generate Signed Bundle / APK → APK
```

### Generate Release AAB (for Google Play)
```
Build → Generate Signed Bundle / APK → Android App Bundle
```

### Run directly from CLI (emulator must be running)
```bash
npm run cap:run:android
```

---

## Step 6B — Build & Run on iOS

> ⚠️ Requires macOS with Xcode 15+ and Apple Developer account.

### Prerequisites
```bash
# Install CocoaPods
sudo gem install cocoapods

# OR use Homebrew
brew install cocoapods
```

### Open in Xcode
```bash
npx cap open ios
# OR
npm run cap:ios
```

### In Xcode:
1. Select your team (Signing & Capabilities)
2. Select device / simulator
3. Click ▶ Run

### Build .ipa for TestFlight
```
Product → Archive → Distribute App → App Store Connect
```

---

## Step 7 — Configure Splash Screen & Icons

### Android Icons
Replace files in `android/app/src/main/res/`:
```
mipmap-mdpi/ic_launcher.png       (48×48)
mipmap-hdpi/ic_launcher.png       (72×72)
mipmap-xhdpi/ic_launcher.png      (96×96)
mipmap-xxhdpi/ic_launcher.png     (144×144)
mipmap-xxxhdpi/ic_launcher.png    (192×192)
```

Use [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/) or
generate from a single 1024×1024 PNG with:
```bash
npx @capacitor/assets generate --android --ios --pwa --assetPath ./public/icons/icon-1024.png
```

### Android Splash Screen
Add `splash.png` (2732×2732 px, logo centered, navy background `#0A0E1A`) to:
```
android/app/src/main/res/drawable/splash.png
android/app/src/main/res/drawable-land-hdpi/splash.png
android/app/src/main/res/drawable-port-hdpi/splash.png
```

Or use the `@capacitor/assets` command above — it generates everything automatically.

---

## Step 8 — Android Permissions (AndroidManifest.xml)

Add to `android/app/src/main/AndroidManifest.xml` inside `<manifest>`:

```xml
<!-- Required for maps (location optional but nice to have) -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<!-- Camera for venue photo uploads -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />

<!-- Optional: show nearby venues -->
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

---

## Step 9 — Supabase Auth Redirect URI (OAuth)

For Google Sign-In to work in the native WebView, add your Capacitor scheme
as a redirect URI in your Supabase project:

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add to **Redirect URLs**:
   ```
   ng.eventually.app://login-callback
   https://your-app.vercel.app/auth/callback
   ```

In your auth code:
```typescript
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: Capacitor.isNativePlatform()
      ? 'ng.eventually.app://login-callback'
      : `${window.location.origin}/auth/callback`,
  },
});
```

---

## Step 10 — Stripe in WebView

Stripe Checkout redirects work in the WebView. Add your app scheme to allowed URLs:

```typescript
// When creating Stripe checkout, set success/cancel URLs to your web domain:
const session = await stripe.checkout.sessions.create({
  success_url: 'https://eventually.ng/success',
  cancel_url: 'https://eventually.ng/dashboard',
  // ...
});
```

The WebView will open Stripe in the system browser via `@capacitor/browser`:
```typescript
import { Browser } from '@capacitor/browser';
await Browser.open({ url: stripeCheckoutUrl });
```

---

## Iterative Development Workflow

After making code changes:
```bash
npm run mobile:sync
# Then press Ctrl+R in Android Studio or Xcode to reload
```

For quick iteration without rebuilding native:
```bash
# Edit capacitor.config.ts → uncomment the server.url line:
# server: { url: "http://192.168.x.x:3000" }

npm run dev
npx cap sync
# Run on device → it points to your dev server (live reload!)
```

---

## Warnings & Limitations

| Feature | Status in Native WebView | Fix |
|---------|--------------------------|-----|
| Server Actions | ❌ Broken (needs server) | Convert to Supabase client calls |
| API Routes (/api/*) | ❌ Broken | Move to Supabase Edge Functions |
| next/image optimization | ⚠️ Unoptimized | Already handled via `unoptimized: true` |
| Stripe Checkout redirect | ✅ Works via Browser plugin | Use `@capacitor/browser` |
| Supabase Realtime | ✅ Works | WebSocket works in WebView |
| Leaflet Maps | ✅ Works | Tiles load over HTTP in WebView |
| Google OAuth | ✅ Works | Needs redirect URI configured |
| Photo upload | ✅ Works | HTML file input works in WebView |
| Push Notifications | 🔧 Not set up | Add `@capacitor/push-notifications` |
| In-App Purchases | 🔧 Not set up | Consider for subscriptions |

---

## Google Play Store Checklist

- [ ] Generate signed `.aab` with release keystore
- [ ] App icons all sizes generated
- [ ] Splash screens generated  
- [ ] Privacy policy URL ready (required for apps with auth)
- [ ] Screenshots for Play Store listing (phone + 7" tablet)
- [ ] Target SDK 35 (required by Google Play in 2025)
- [ ] Content rating questionnaire completed
- [ ] minSdkVersion 24 (Android 7.0) — covers Nigerian market

---

## iOS App Store Checklist

- [ ] Apple Developer account ($99/year)
- [ ] Provisioning profile & signing cert
- [ ] App icons (1024×1024 for App Store)
- [ ] Screenshots (6.7" + 5.5" required)
- [ ] Privacy policy URL
- [ ] App Privacy "nutrition label" filled in Xcode

---

## Support

Built for Lagos by Lagos. 🌴  
Questions? hello@eventually.ng
