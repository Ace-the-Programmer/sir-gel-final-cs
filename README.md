# TaraCommute – Smart Campus Route & Fare Estimation App

A mobile navigation and public transit fare estimation application developed for university students and daily commuters in Cabanatuan City, Nueva Ecija. Built with **Ionic 8**, **Angular 20 Standalone Components**, **Capacitor 8**, and **Leaflet Maps**, backed by a local **PHP & MySQL (XAMPP)** backend.

---

## 📱 Features

- **Standardized Student Fare Matrix**:
  - Implements official **Cabanatuan City Ordinance No. 050-2026** and **LTFRB Region 3** fare regulations with student discount support:
    - **Tricycle (Shared / Regular Rapok):** ₱28.00 base (first 3 km) + ₱5.00/km thereafter.
    - **Solo Tricycle (Special Trip):** ₱56.00 base (first 3 km) + ₱10.00/km thereafter.
    - **Traditional Public Utility Jeepney (PUJ):** ₱11.25 base (first 4 km) + ₱1.60/km thereafter.
    - **Modern Jeepney:** ₱13.50 base (first 4 km) + ₱1.92/km thereafter.
    - **Car / Taxi:** ₱45.00 base + ₱15.00/km (with 10% student promo).
    - **Bicycle:** ₱15.00 flat campus mobility rate.
    - **Walk:** FREE (₱0.00) with dynamic step count and calorie burn estimations.
- **Interactive Campus Map & Live Geolocation**:
  - High-performance vector map rendered using **Leaflet.js** and OpenStreetMap tiles.
  - GPS device positioning via `@capacitor/geolocation` with custom blue pulsed commuter pin.
  - Preloaded with major Cabanatuan campus hubs and transit points:
    - Araullo University (Main Campus)
    - Sumacab Campus
    - SM City Cabanatuan
    - Pacific Mall Cabanatuan
    - NE Pacific Mall
    - Cabanatuan Central Transport Terminal
    - SM Mega Center Cabanatuan
    - Santa Rosa Junction
- **Route Estimation & Autocomplete**:
  - Real-time search with instant suggestions for campus landmarks.
  - Haversine geodesic distance calculation with estimated transit travel times for all modes.
  - Dynamic route dashed polylines and interactive destination cards.
- **100% Angular Ionic Standalone Components**:
  - Modern standalone architecture using `@ionic/angular/standalone`.
  - Built strictly using official Ionic UI components (`<ion-grid>`, `<ion-row>`, `<ion-col>`, `<ion-card>`, `<ion-card-header>`, `<ion-card-title>`, `<ion-card-content>`, `<ion-list>`, `<ion-item>`, `<ion-label>`, `<ion-text>`, `<ion-badge>`, `<ion-chip>`, `<ion-button>`, `<ion-input>`, `<ion-select>`).
- **Student Authentication & Digital Commuter Pass**:
  - Quick registration using Student ID Number, Full Name, Course (BSIT, BSCS, BSIS, etc.), Year Level, and Password.
  - Digital **Campus Commuter ID Pass** displaying real-time commuter status, course details, and ordinal year levels (e.g. *1st Year*).
- **PHP & MySQL Database Backend**:
  - Synchronizes with local XAMPP Apache & MySQL RESTful API (`http-backend/api`):
    - `POST /api/auth.php` – Student sign-in verification.
    - `GET/POST /api/students.php` – Commuter directory synchronization & registration.
    - `GET/POST/DELETE /api/commute_history.php` – Commute trip logging and fare breakdown tracking.
    - `GET /api/locations.php` – Campus hubs and transit terminals.

---

## 🚀 How to Run the App

### 1. Start the Local Backend (XAMPP)
1. Open the **XAMPP Control Panel**.
2. Start **Apache** and **MySQL**.
3. Place the backend API folder in your XAMPP `htdocs` directory:
   `C:/xampp/htdocs/http-backend/`
4. Verify the backend responds at `http://localhost/http-backend/api/students.php`.

---

### 2. Run the Frontend in the Browser
Inside the `tara-commute` folder:

```bash
# Install dependencies (if not already installed)
npm install

# Start the Angular development server
npm start
# or
ionic serve
```

Open your browser at `http://localhost:8100/`. (Press `F12` and toggle device mode to view in mobile view).

---

### 3. Build Web Assets
```bash
npm run build
```

---

### 4. Build and Run on Android (Capacitor)

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
3. Locate `app-debug.apk` under:
   `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📂 Project Structure

```
sir-gel-final-cs/
├── tara-commute/                    # Main Ionic Angular Application
│   ├── android/                     # Capacitor Native Android Project
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/           # Main Commuter Dashboard
│   │   │   ├── home/                # Home Overview & Shortcuts
│   │   │   ├── location-search/     # Search & Transit Estimation
│   │   │   ├── login/               # Student ID & Password Sign-in
│   │   │   ├── map/                 # Leaflet Map & Fare Matrix Calculator
│   │   │   ├── profile/             # Commuter Pass & Trip History
│   │   │   ├── services/            # StudentService & API Integration
│   │   │   ├── welcome/             # Student Onboarding & Sign-up
│   │   │   ├── app.component.ts     # Root Ionic App Component
│   │   │   └── app.routes.ts        # Standalone Route Configuration
│   │   ├── assets/                  # Icons, Logos & Transit Graphics
│   │   ├── theme/                   # Ionic Theme Colors & Variables
│   │   ├── global.scss              # Global Styles
│   │   └── index.html               # SPA Entry Point
│   ├── capacitor.config.ts          # Capacitor App Configuration
│   ├── angular.json                 # Angular Build Configuration
│   ├── ionic.config.json            # Ionic Project Config
│   └── package.json                 # Dependencies & Build Scripts
└── README.md                        # Root Project Documentation
```

---

## 🛠️ Built With

- **Framework:** [Ionic Framework 8](https://ionicframework.com/)
- **Core Engine:** [Angular 20](https://angular.dev/) (Standalone Components)
- **Native Runtime:** [Capacitor 8](https://capacitorjs.com/)
- **Mapping:** [Leaflet.js](https://leafletjs.com/)
- **Backend:** PHP 8.x + MySQL (via XAMPP)
- **Styling:** SCSS & Ionic CSS Variables
