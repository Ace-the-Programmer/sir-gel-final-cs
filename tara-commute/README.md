# TaraCommute – Smart Campus Route & Fare Estimation App

A mobile navigation and public transit fare estimation application developed for university students and daily commuters in Cabanatuan City, Nueva Ecija. Built with **Ionic 8**, **Angular 20 Standalone Components**, **Capacitor 8**, and **Leaflet Maps**, backed by a local **PHP & MySQL (XAMPP)** RESTful backend.

---

## 📱 Features

- **Standardized Student Fare Matrix**:
  - Implements official **Cabanatuan City Ordinance No. 050-2026** and **LTFRB Region 3** fare regulations with a dedicated 1-tap **20% Student Fare Discount** toggle (Republic Act 11314):
    - **Jeep (Traditional PUJ):** ₱14.00 regular base / ₱11.20 student base (first 4 km) + ₱2.00/km regular / ₱1.60/km student thereafter.
    - **Tricycle (Shared / Rapok):** ₱35.00 regular base / ₱28.00 student base (first 3 km) + ₱5.00/km regular / ₱4.00/km student thereafter (Cabanatuan Ord. No. 050-2026).
    - **Bus (Student Campus Bus):** ₱15.00 regular base / ₱12.00 student base (first 5 km) + ₱2.25/km regular / ₱1.80/km student thereafter.
    - **Mini Bus / Modern PUV:** ₱17.00 regular base / ₱13.60 student base (first 4 km) + ₱2.40/km regular / ₱1.90/km student thereafter.

- **Interactive Campus Map & Live Geolocation**:
  - Vector map rendering using **Leaflet.js** and OpenStreetMap tiles.
  - Device GPS integration via `@capacitor/geolocation` with custom blue pulsing commuter pin.
  - Preloaded with major Cabanatuan campus hubs and transit points:
    - NEUST Sumacab Campus
    - Araullo University (Main Campus)
    - Wesleyan University - Philippines
    - SM City Cabanatuan
    - Pacific Mall Cabanatuan
    - Cabanatuan Central Transport Terminal

- **Location Privacy Protection**:
  - Protects student residential privacy during live presentations and recordings by omitting raw coordinates from all UI inputs and popups.
  - Commuter starting origin is masked to the central **Cabanatuan Campus Commuter Hub** (`15.4858, 120.9672`).

- **Responsive Dual Design (PC Website & Mobile Phone)**:
  - **PC / Desktop Web (`≥ 768px`)**: Renders a 2-column web dashboard with a top navigation bar (Logo, Home, Map, Route & Fare, Profile), hero banner, and hides mobile bottom bars.
  - **Mobile Phone (`< 768px`)**: Adapts to a mobile app layout with stacked cards and a fixed bottom navigation bar with an elevated Route button.

- **Commuter Authentication & Enterprise Security**:
  - Streamlined registration form collecting **Username**, **Full Name**, **School** (NEUST, Araullo, Wesleyan, CRT, etc.), and **Password**.
  - **BCrypt Password Hashing** (`PASSWORD_BCRYPT` with cost factor 12) for secure credential storage.
  - **Stateless Bearer Token Authentication** using 256-bit cryptographically secure pseudorandom numbers (`bin2hex(random_bytes(32))`).
  - **Brute-Force Rate Limiting & Account Lockout**: Accounts are automatically locked for 5 minutes after 5 consecutive failed login attempts (HTTP 429).
  - SQL injection prevention via PHP PDO parameterized prepared statements and HTTP security hardening headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`).

- **Commute Trip History (Full CRUD Integration)**:
  - Users can record completed trips to their personal profile history via HTTP POST.
  - Personal commute records are loaded directly from MySQL via HTTP GET and can be removed via HTTP DELETE.

---

## 🚀 How to Run the App

### 1. Start the Local Backend (XAMPP)
1. Open the **XAMPP Control Panel**.
2. Start **Apache** and **MySQL**.
3. Place the backend API folder in your XAMPP `htdocs` directory:
   ```
   C:/xampp/htdocs/http-backend/
   ```
4. Verify the backend responds at:
   ```
   http://localhost/http-backend/api/auth.php?action=users
   ```

---

### 2. Run the Frontend in the Browser

Navigate into the `tara-commute` project directory:

```bash
cd tara-commute
```

Install dependencies (if not already installed):

```bash
npm install
```

Start the application with live reload using **`ionic serve`**:

```bash
ionic serve
```

The application will open automatically in your default browser at:
```
http://localhost:8100/
```

* **Desktop View**: View at standard browser window size (`100%` zoom) to see the PC web layout.
* **Mobile View**: Press `F12` (Developer Tools) and toggle Device Toolbar (`Ctrl + Shift + M`) to view as a mobile phone.

---

### 3. Build Web Production Bundle

To compile the production Angular application bundle:

```bash
npm run build
```

---

### 4. Build and Run on Android (Capacitor)

#### Step 1: Copy Assets to Android Native Project
```bash
npx cap copy android
```

#### Step 2: Compile Debug APK using Gradle
Inside the `tara-commute` folder:

```powershell
cd android
.\gradlew assembleDebug
cd ..
```

The compiled APK will be generated at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```
Copy it to the project root for testing:
```powershell
Copy-Item "android\app\build\outputs\apk\debug\app-debug.apk" -Destination "Tara-Commute.apk" -Force
```

#### Step 3: (Optional) Open in Android Studio
```bash
npx cap open android
```

---

## 📂 Project Structure

```
sir-gel-final-cs/
├── tara-commute/                    # Main Ionic Angular Application
│   ├── android/                     # Capacitor Native Android Project
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/           # Main Commuter Dashboard
│   │   │   ├── location-search/     # Responsive Route & Fare Planner
│   │   │   ├── login/               # Secured Sign-In (Username & Password)
│   │   │   ├── map/                 # Leaflet Map & Interactive Fare Matrix
│   │   │   ├── profile/             # Commuter Pass & Commute Trip History
│   │   │   ├── services/            # StudentService (HttpClient & Bearer Auth)
│   │   │   ├── welcome/             # Simplified Registration (Username & School)
│   │   │   ├── app.component.ts     # Root Component
│   │   │   └── app.routes.ts        # Standalone Route Configuration
│   │   ├── assets/                  # Icons, Logos & Transit Graphics
│   │   ├── theme/                   # Ionic Theme Colors & Variables
│   │   ├── global.scss              # Global Styling
│   │   └── index.html               # Single Page Application Entry
│   ├── capacitor.config.ts          # Capacitor App Configuration
│   ├── angular.json                 # Angular Build & Budget Config
│   ├── ionic.config.json            # Ionic Project Config
│   └── package.json                 # Dependencies & Build Scripts
└── README.md                        # Root Project Documentation
```

---

## 🛠️ Tech Stack

- **Frontend Framework:** [Ionic Framework 8](https://ionicframework.com/)
- **Core Engine:** [Angular 20](https://angular.dev/) (Standalone Components)
- **Native Runtime:** [Capacitor 8](https://capacitorjs.com/)
- **Mapping & Routing:** [Leaflet.js](https://leafletjs.com/) + OpenStreetMap
- **Backend:** PHP 8.x + MySQL (via XAMPP Apache)
- **Security:** BCrypt Hashing, Bearer Token Auth, Brute-Force Rate Limiting
- **Styling:** SCSS & Ionic CSS Variables (Responsive Desktop & Mobile)
