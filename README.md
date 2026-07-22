<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield-alert.svg" alt="OpenCAD Logo" width="100" height="100" />
  
  # 🚨 OpenCAD Responder Platform
  
  **The next-generation, cross-platform Mobile Responder terminal for emergency services.**
  
  [![Android](https://img.shields.io/badge/Android-Jetpack_Compose-3DDC84?style=for-the-badge&logo=android&logoColor=white)](#-1-native-android-app-root)
  [![Web](https://img.shields.io/badge/Web-React_%7C_Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](#-2-web-app-react--tailwind)
  [![Desktop](https://img.shields.io/badge/Desktop-Kotlin_Multiplatform-7F52FF?style=for-the-badge&logo=kotlin&logoColor=white)](#-3-compose-multiplatform-desktop--wasm)
  
</div>

---

## ⚡️ About OpenCAD
**OpenCAD Responder** is the "Field" component of the OpenCAD Operations Platform. Designed for Police, Fire, and EMS, this high-contrast, fat-finger-friendly terminal keeps responders linked to dispatch in real-time. 

Say goodbye to legacy, refresh-heavy CADs. OpenCAD is built for **speed**, **reliability**, and **situational awareness**.

<br/>

## 🛠️ Repository Architecture

To ensure maximum compatibility across any agency's hardware, this repository contains **three** distinct deployment targets:

| 📂 Directory | 💻 Technology | 🎯 Best For | 🚀 Deployment |
|:---|:---|:---|:---|
| [`/`](#-1-native-android-app-root) | **Kotlin / Jetpack Compose** | Android MDTs, rugged tablets, and responder phones. | Direct APK install or Google Play. |
| [`/web-export`](#-2-web-app-react--tailwind) | **React / Tailwind CSS** | Cross-platform Progressive Web App (iOS, Android, Web). | [Vercel](#option-a-vercel-react-web-app), Netlify, or self-hosted. |
| [`/multiplatform-export`](#-3-compose-multiplatform-desktop--wasm) | **Compose Multiplatform** | Native Desktop (.exe, .dmg) & WebAssembly (Wasm). | Desktop PCs or [GitHub Pages](#option-b-github-pages-kotlin-wasm). |

---

## 🚀 Quick Start: Deploying Live

Get your agency's CAD terminal live in less than 5 minutes!

### Option A: Vercel (React Web App)
*Recommended for the fastest cross-platform mobile access (iOS/Android/Web).*

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Log into [Vercel.com](https://vercel.com) and import this repository.
2. ⚠️ **CRITICAL:** In the project settings, change the **Root Directory** to `web-export`.
3. Keep the framework preset as **Vite** and hit **Deploy**.

### Option B: GitHub Pages (Kotlin Wasm)
*Recommended for running the native Kotlin code in a desktop browser.*

1. Go to this repository's **Settings** tab on GitHub.
2. Click **Pages** in the left sidebar.
3. Under **Build and deployment**, change the Source dropdown to **GitHub Actions**.
4. 🪄 *Magic!* The included `deploy-wasm.yml` workflow will automatically build and publish your app. Check the **Actions** tab for your live link!

---

## 💻 Local Development Guide

Want to build and test locally? Here's how to spin up each environment:

<details>
<summary><b>🤖 1. Native Android App (Root)</b></summary>
<br/>

1. Open the root directory in **Android Studio**.
2. Sync the Gradle project.
3. Hit ▶️ **Run** to launch on a physical device or emulator.
*Alternatively, run `gradle assembleDebug` from the command line.*
</details>

<details>
<summary><b>⚛️ 2. Web App (React + Tailwind)</b></summary>
<br/>

1. Navigate to the web folder: `cd web-export`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Open `http://localhost:5173` in your browser.
</details>

<details>
<summary><b>🧩 3. Compose Multiplatform (Desktop / Wasm)</b></summary>
<br/>

1. Navigate to the multiplatform folder: `cd multiplatform-export`
2. **Run Desktop:** `./gradlew run`
3. **Run WebAssembly Locally:** `./gradlew wasmJsBrowserRun`
4. **Build Desktop Installer (.exe/.dmg):** `./gradlew packageDistributionForCurrentOS`
</details>

---

## ✨ Core Features

- 🌒 **High-Contrast Tactical UI:** Dark mode by default (Slate backgrounds with high-visibility accents) to reduce eye strain in vibrating vehicles.
- 🚨 **Incident Intake Display:** Instantly shows assigned incidents with pulsing visual indicators for priority calls, displaying call nature, location, and dispatch notes.
- 🗺️ **One-Tap Navigation:** Built-in **"NAVIGATE"** button that instantly hands off coordinates to Google Maps/Apple Maps.
- 👆 **Status Grid:** "Fat-finger" friendly buttons for quickly changing status (*En Route*, *On Scene*, *Clear & Available*) without needing precision taps.
- 💬 **Immutable Log & Chat:** Real-time event log and unified chat system to communicate silently with dispatch.

---
<div align="center">
  <i>Built with ❤️ for Public Safety Professionals.</i>
</div>
