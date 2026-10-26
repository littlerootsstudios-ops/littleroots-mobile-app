# LittleRoots for phones and tablets

The touch version of LittleRoots (Christian stories and songs for kids and family), plus the Android app.

| Part | Where | What it is |
|---|---|---|
| **Phone web app** | `web/littleroots-mobile.html` | Portrait browsing with swipeable rows, category pages, search, slide-up story details, a full-screen player that turns sideways by itself (tap for controls, double-tap the sides to skip 10 s, drag to scrub, lock for little hands), and **Little Moments**: the Shorts as a swipe-up feed. Grown-ups settings sit behind a times-table question. |
| **Android app** | `android/` | A small native app (phones, tablets, Android TV / Google TV) that shows the phone web app full screen, turns sideways for stories, keeps the screen on while watching, and handles the Back button. On TVs it opens the TV app instead. |

The library (videos, categories, featured story) comes from the LittleRoots backend and is managed on the Admin page:
`https://app.littlerootsstudios.com/admin/`.

## Where it runs
- **Phone web app:** `https://app.littlerootsstudios.com/m/`. Phones that open the main address are sent here automatically.
  The backend (repo `littlerootsstudios-ops/Littleroot-tv-app`) builds and serves this repo's `web/` folder; its file `mobile-app.ref` names the commit of this repo it serves. To publish a change here, update that file in the backend repo.
- **iPhone / iPad:** open the address in Safari → Share → **Add to Home Screen**. It opens full screen with the LittleRoots icon.
- **Android:** install `LittleRoots.apk` from the `apk` branch (built by the *Build Android app* workflow on every change to `android/`).

## Build
```bash
npm ci
npm run build          # dist/index.html: the phone web app, made safe for older phone browsers
npm run icons          # remakes the Android and home-screen icons from brand/littleroots-logo.svg (needs Playwright)
gradle -p android assembleRelease   # Android APK (needs the Android SDK; the GitHub workflow does this)
```

## Notes
- The Android APK is signed with a **test key** (`android/app/littleroots-test.jks`) so it can be installed directly and updated over itself. The Google Play version will use a private key kept out of this repository.
- Watch progress and settings are stored on the device and are shared with the TV web app in the same browser.
- Videos stored with LittleRoots play through hls.js (native HLS on iPhone). Videos still on YouTube play inside the same LittleRoots player.
