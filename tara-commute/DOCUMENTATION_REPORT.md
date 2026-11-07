# FINAL CASE STUDY: MOBILE APPLICATION TECHNOLOGY
## TaraCommute: Smart Campus Route & Fare Estimation Platform

---

### 1. Project Information

- **Project Title:** TaraCommute: Smart Campus Route & Fare Estimation Platform
- **Course & Code:** Mobile Application Technology (Final Case Study)
- **Target Platform:** Android (Capacitor Native) & Web Responsive (Ionic Framework)
- **Repository Link:** [https://github.com/Ace-the-Programmer/sir-gel-final-cs](https://github.com/Ace-the-Programmer/sir-gel-final-cs)
- **Group Members:**
  - *Lead Developer / Commuter Systems Specialist:* [Student Name / Ace] (BSIT / BSCS)
  - *Collaborator / Documentation & Testing:* [Student Name / Group Members]

---

### 2. Problem and Proposed Solution

#### 2.1 Problem Identification
In Cabanatuan City and surrounding municipalities in Nueva Ecija, thousands of tertiary university students (such as those attending Araullo University Main and Sumacab campuses) commute daily via public utility tricycles, jeepneys, and buses. Despite official local fare ordinances issued by the Sangguniang Panlungsod (City Ordinance No. 050-2026) and regional LTFRB regulations, student commuters continuously face several practical problems:
1. **Fare Inconsistency & Overcharging:** Tricycle drivers often charge arbitrary "special" rates or fail to grant the mandatory 20% student fare discount during peak hours or rainy days.
2. **Lack of Transparent Route Pricing:** Students visiting from other towns or unfamiliar with local distances are unable to verify whether a charged fare matches the official base distance rate (first 3 km) or per-kilometer rate.
3. **Fragmented Campus Commuting Information:** No unified mobile application specifically maps key campus hubs (Main Campus, Sumacab, terminals, transport junctions) alongside live fare estimates tailored to student budgets.

#### 2.2 Intended Users
- University and college students commuting across Cabanatuan City and Nueva Ecija.
- Campus visitors, student organizations, and faculty members.
- Campus transport administrators seeking fare transparency.

#### 2.3 Proposed Solution: TaraCommute
**TaraCommute** is a focused mobile application designed to empower student commuters with immediate, ordinance-accurate transit guidance. By combining **Capacitor Geolocation**, high-speed **Leaflet vector mapping**, and an integrated **Local PHP/MySQL database**, TaraCommute enables students to:
- Instantly verify the regulated fare for any trip across 6 transportation modes (Tricycle Shared, Tricycle Solo, Traditional Jeepney, Modern Jeepney, Car/Taxi, and Bicycle/Walk).
- Automatically pinpoint their current location with GPS and view distances to all campus hubs.
- Maintain a local, verified **Campus Commuter ID Pass** that records their academic degree, ordinal year level, and commute trip logs.

---

### 3. Application Features & User Interaction

#### Feature 1: Official Student Fare Matrix Calculator
- **Description:** Implements official Cabanatuan City Ordinance No. 050-2026 and LTFRB Region 3 fare matrices.
- **Interaction:** Users can adjust their trip distance manually (slider or numeric input) or calculate it directly from the map. The app computes fares across multiple transport modes:
  - *Tricycle (Shared / Rapok):* ₱28.00 base for first 3.0 km + ₱5.00 for each succeeding km (Student rate).
  - *Tricycle (Solo / Special Trip):* ₱56.00 base for first 3.0 km + ₱10.00 per succeeding km.
  - *Traditional PUJ:* ₱11.25 base for first 4.0 km + ₱1.60 per succeeding km.
  - *Modern PUJ:* ₱13.50 base for first 4.0 km + ₱1.92 per succeeding km.
  - *Taxi / Car:* ₱45.00 base + ₱15.00 per succeeding km (with 10% student promo).
  - *Walking / Cycling:* ₱0.00 / ₱15.00 flat campus rate, including step count and calorie burn estimates.

#### Feature 2: Interactive Campus Map & Live Geolocation
- **Description:** Renders high-resolution OpenStreetMap tiles via Leaflet.js with zero external subscription costs.
- **Interaction:** On launch, the app triggers `@capacitor/geolocation` to center the map on the user’s coordinates, placing an animated blue commuter pulse marker. Campus hubs (Araullo University, SM Cabanatuan, Pacific Mall, Central Terminal, Santa Rosa) are pre-mapped with markers. Tapping any campus hub draws a blue route polyline, computes the geodesic distance using the Haversine formula, and opens an instant route fare card.

#### Feature 3: Live Autocomplete Transit Search
- **Description:** Real-time search bar that filters campus hubs and transit junctions dynamically as the commuter types.
- **Interaction:** Selecting any suggested location updates the origin-destination corridor and presents immediate multi-modal fare breakdowns.

#### Feature 4: Student Authentication & Digital Campus Commuter Pass
- **Description:** A streamlined, privacy-conscious authentication flow tailored specifically for campus use without requiring third-party OAuth (Gmail/Facebook).
- **Interaction:** Students register with their Student ID Number, Full Name, Course (BSIT, BSCS, BSIS, etc.), Year Level, and Password. Upon login, the **Profile** screen renders a digital **Campus Commuter ID Pass** formatted with their year level (*1st Year*, *2nd Year*, etc.) and active commuter badge.

#### Feature 5: Commute Trip History Logging (MySQL Synchronization)
- **Description:** Records calculated trips into a persistent database via a local REST API.
- **Interaction:** Commuters can log trips from the map sheet or the profile screen. Trips record origin, destination, vehicle mode, distance in km, and fare amount. Entries are synced to MySQL and can be reviewed or deleted directly from the app interface.

---

### 4. Technical Implementation

#### 4.1 Architecture & Core Frameworks
- **Frontend Framework:** Angular 20 (`@angular/core`) using pure **Standalone Components** (`standalone: true`).
- **UI Component Library:** Ionic Framework 8 (`@ionic/angular/standalone`). All screens are built strictly using official Ionic tags (`<ion-card>`, `<ion-grid>`, `<ion-row>`, `<ion-col>`, `<ion-list>`, `<ion-item>`, `<ion-label>`, `<ion-text>`, `<ion-badge>`, `<ion-chip>`, `<ion-button>`, `<ion-spinner>`).
- **Mobile Container:** Capacitor 8 (`@capacitor/core`, `@capacitor/android`).

#### 4.2 Capacitor Capabilities Integrated
1. **`@capacitor/geolocation`:**
   - Used in `MapPage` (`map.page.ts`) to request runtime location permissions and retrieve the device's precise latitude and longitude.
2. **`@capacitor/haptics`:**
   - Provides tactile vibration feedback when students calculate fares or log trips.
3. **`@capacitor/preferences`:**
   - Serves as an offline-first storage fallback to cache user session state and commuter data when network connections are unavailable.

#### 4.3 External Service & Data Operations (Local RESTful Backend)
- **Technology Stack:** PHP 8.x + MySQL running locally via XAMPP (`http://localhost/http-backend/api`).
- **API Operations:**
  - `POST /api/auth.php` – Validates student credentials and generates session tokens.
  - `GET /api/students.php` – Fetches the registered campus commuter directory.
  - `POST /api/students.php` – Inserts a new student commuter record into the database.
  - `GET /api/commute_history.php` – Retrieves trip logs for the logged-in student.
  - `POST /api/commute_history.php` – Records a new commute trip with calculated fare and distance.
  - `DELETE /api/commute_history.php?id={id}` – Removes a trip entry from MySQL.

#### 4.4 Distance & Fare Calculation Algorithm
The geodesic distance between GPS coordinates is computed via the Haversine trigonometric formula, and fares are calculated according to the official rate matrices in `StudentService.calculateFare()`.

---

### 5. Testing and Evaluation

#### 5.1 Test Results Matrix

| Test Case # | Feature / Task Tested | Expected Result | Actual Result | Status |
|:---:|:---|:---|:---|:---:|
| **TC-01** | Student Registration | Account created in local MySQL `students` table with hashed password. | Record inserted, confirmation toast displayed. | **PASS** |
| **TC-02** | Student Login Authentication | Valid ID & password allows entry; invalid displays error toast. | Authentic credentials route to dashboard; wrong password alerts user. | **PASS** |
| **TC-03** | GPS Location Acquisition | Device triggers permission dialog and acquires live coordinates. | GPS pinpointed accurately; blue pulsed marker rendered on Leaflet map. | **PASS** |
| **TC-04** | Route Polyline & Distance | Tapping campus landmark draws polyline and computes km. | Blue route line drawn; Haversine distance matches road corridors. | **PASS** |
| **TC-05** | Ordinance Fare Calculation | 5.0 km tricycle trip computes: ₱28 base + (2 km × ₱5) = ₱38.00. | Calculated fare matches ₱38.00 exactly according to Ordinance 050-2026. | **PASS** |
| **TC-06** | Trip History Logging (POST) | Calculated trip saved to MySQL `commute_history` table. | Trip added to database; immediately visible in profile history list. | **PASS** |
| **TC-07** | Trip Record Deletion (DELETE) | Clicking trash icon removes trip from MySQL and UI. | HTTP DELETE dispatched; record removed from list with success alert. | **PASS** |
| **TC-08** | Offline Fallback | App operates basic calculator when XAMPP server is stopped. | App notifies user of offline status and uses local memory cache. | **PASS** |

#### 5.2 Observed Usability Issues & Limitations
1. **Straight-line Geodesic Distance vs. Actual Road Trajectory:** The prototype uses Haversine geodesic calculations. In dense urban street networks, road distance is typically 15–20% longer than straight-line distance.
2. **Localhost Network Boundary on Native Devices:** While running in the browser or on an Android emulator, the app connects directly to `localhost`. On a physical phone connected over Wi-Fi, the backend host IP must be set to the development machine's local IPv4 (e.g. `192.168.1.X`).

#### 5.3 Proposed Future Improvements
- Integrate an OpenStreetMap OSRM (Open Source Routing Machine) routing engine to follow actual road vectors.
- Implement a QR code generator for the digital Campus Commuter Pass to allow contactless verification.
- Add crowd-sourced fare reporting allowing students to flag overcharging tricycle terminals.

---

### 6. AI Usage Disclosure

In compliance with the project guidelines, AI assistance was utilized as a development accelerator:

1. **AI Tools Used:** Google DeepMind Advanced Agentic Assistant (Antigravity).
2. **Tasks Assisted:**
   - Scaffolding the mathematical formula for Cabanatuan City Ordinance No. 050-2026 in TypeScript.
   - Refactoring generic HTML tags (`<div>`, `<span>`, `<button>`) into strict Angular Ionic Standalone components (`<ion-card>`, `<ion-grid>`, `<ion-item>`, `<ion-text>`).
   - Generating standard PHP PDO database connection scripts (`http-backend/api`).
3. **Student Review & Verification:**
   - All generated code was reviewed, compiled with `ng build` (verified exit code 0), and manually tested through the browser and mobile viewports.
   - Test cases, fare matrices, and database tables were independently verified by the group members against official local fare ordinances.
