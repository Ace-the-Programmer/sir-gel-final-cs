# CampusFix – Campus Incident & Maintenance Reporting App

A mobile application developed for **Mobile Application Technology Final Case Study** using **Ionic Angular Standalone Components** and **Capacitor**.

---

## 📱 Features

- **100% Ionic UI Components:** Pure mobile interface built with `<ion-header>`, `<ion-toolbar>`, `<ion-tabs>`, `<ion-card>`, `<ion-list>`, `<ion-item>`, `<ion-select>`, `<ion-badge>`, `<ion-chip>`, and `<ion-button>` (no generic HTML tags).
- **Capacitor Camera (`@capacitor/camera`):** Capture photos directly from the device camera or select from the photo gallery.
- **Capacitor Geolocation (`@capacitor/geolocation`):** Acquire and tag live GPS coordinates (latitude/longitude) of the campus maintenance issue.
- **Capacitor Haptics (`@capacitor/haptics`):** Tactile vibration feedback on button presses, report submissions, and status changes.
- **Persistent Data Management (`@capacitor/preferences`):** Offline-first storage saving reports across app relaunches and device reboots.
- **Feed Search & Segment Filtering:** Instant live search by title, room, building, category, and status filter (*Pending*, *In Progress*, *Resolved*).
- **Overview & Emergency Directory:** Real-time statistics counter and university maintenance/safety hotline numbers.

---

## 🚀 How to Run the App

### 1. Run in the Browser (Development Server)
Inside the `campus-fix` folder:
```bash
npm start
```
or
```bash
ionic serve
```
Then open your browser at `http://localhost:8100/`. (Press `F12` and toggle device toolbar to view in mobile dimension).

---

### 2. Build Web Assets
```bash
npm run build
```

---

### 3. Sync & Run on Android / Generate APK

#### Step 1: Sync Capacitor with Android
```bash
npx cap sync android
```

#### Step 2: Open in Android Studio
```bash
npx cap open android
```

#### Step 3: Generate APK
1. In Android Studio, wait for Gradle sync to complete.
2. Go to **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
3. Once the build finishes, click **locate** to find `app-debug.apk` in:
   `android/app/build/outputs/apk/debug/app-debug.apk`
4. Copy this APK to your phone or upload it for submission!

---

## 📂 Project Structure

```
campus-fix/
├── android/                         # Capacitor Native Android Project
├── src/
│   ├── app/
│   │   ├── models/
│   │   │   └── incident.model.ts    # TypeScript Data Models & Types
│   │   ├── services/
│   │   │   ├── incident.service.ts  # Capacitor Preferences Data Service
│   │   │   └── device.service.ts    # Capacitor Camera, Haptics & Geolocation
│   │   ├── tab1/                    # Tab 1: Incident Feed, Search & Filter
│   │   ├── tab2/                    # Tab 2: New Incident Report Form
│   │   ├── tab3/                    # Tab 3: Analytics & Emergency Directory
│   │   ├── tabs/                    # Tab Navigation Bar
│   │   ├── app.component.ts         # Root Application Component
│   │   └── app.routes.ts            # Angular Standalone Routes
│   ├── global.scss                  # Global Ionic Styles
│   └── index.html                   # HTML Entry Point
├── capacitor.config.ts              # Capacitor Configuration
├── angular.json                     # Angular CLI Build Configuration
└── package.json                     # Project Dependencies & Scripts
```

