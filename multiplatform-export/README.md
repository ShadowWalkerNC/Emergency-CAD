# OpenCAD Multiplatform

This project demonstrates how to run the OpenCAD Responder app across Android, Desktop (macOS/Windows/Linux), and the Web (Wasm) using **Compose Multiplatform**.

## Running on Desktop
To run the native desktop application (without Electron), use the following Gradle command:
```bash
./gradlew run
```

To build a native distributable package (.dmg, .msi, .deb):
```bash
./gradlew packageDistributionForCurrentOS
```

## Running on Web (WebAssembly)
To run the WebAssembly application locally:
```bash
./gradlew wasmJsBrowserRun
```

To build for production deployment (e.g. Vercel, Netlify, GitHub Pages):
```bash
./gradlew wasmJsBrowserDistribution
```
The compiled files will be in `composeApp/build/dist/wasmJs/productionExecutable/`. You can upload this entire folder to your preferred hosting provider.

## Running on Android
To build the Android application:
```bash
./gradlew assembleDebug
```
