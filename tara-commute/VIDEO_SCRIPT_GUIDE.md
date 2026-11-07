# TaraCommute: 8–12 Minute Video Walkthrough & Presentation Script

This script is structured to match the teacher's **Recorded Presentation Guide (Grading Criteria: 100 points)**.

---

## ⏱️ Video Presentation Timing Breakdown

| Segment | Topic | Target Duration |
|:---:|:---|:---:|
| **Part 1** | Problem & Proposed Solution | 1:30 mins |
| **Part 2** | Live Application Walkthrough & Features | 3:30 mins |
| **Part 3** | Technical Implementation & Code Snippets | 3:00 mins |
| **Part 4** | Testing, Usability Limitations & Future Work | 1:30 mins |
| **Part 5** | AI Usage Disclosure & Conclusion | 0:30 mins |
| **TOTAL** | | **~10:00 mins** |

---

## 🎙️ Spoken Script & Screen Action Guide

### Part 1: Problem & Proposed Solution (0:00 – 1:30)
- **Screen:** Title slide showing project name, group members, course, and university.
- **Spoken Script:**
  > *"Good day, Sir Gel and everyone. Today we are presenting our final case study for Mobile Application Technology entitled **TaraCommute: Smart Campus Route and Fare Estimation Platform**.*
  >
  > *In Cabanatuan City, thousands of college students travel daily between campus branches like Araullo University Main and Sumacab campuses, transport terminals, and housing areas. However, students frequently experience arbitrary overcharging by tricycle drivers, lack of awareness regarding the official Cabanatuan City Ordinance No. 050-2026 student fare discounts, and confusion over travel distances.*
  >
  > *To address this problem, our team developed **TaraCommute**, a mobile application built with Ionic 8, Angular Standalone components, Capacitor, and Leaflet Maps, backed by a local MySQL database. It empowers students with instantaneous, ordinance-regulated fare calculations, live GPS campus routing, and a verified digital commuter pass."*

---

### Part 2: Application Walkthrough & Features (1:30 – 5:00)
- **Screen:** Mobile app running in browser or device.

#### 1. Onboarding & Registration (1:30 – 2:30)
- Show the welcome screen.
- Click **Sign Up**. Demonstrate typing Student ID, Full Name, Course (e.g. BSIT), Year Level (e.g. 1st Year), and Password.
- **Spoken Script:**
  > *"Here is the onboarding and login interface. We designed this specifically for campus commuters. A student simply registers using their Student ID, Degree Course, and Year Level. Notice how all inputs utilize official Ionic components with floating labels and haptic response."*

#### 2. Interactive Map & Geolocation (2:30 – 3:45)
- Navigate to the **Map** tab.
- Click the GPS locate button to show the blue pulsing pin.
- Tap a campus hub (e.g., *Sumacab Campus* or *SM City Cabanatuan*).
- Show the blue route line and distance calculation.
- **Spoken Script:**
  > *"On the Map screen, TaraCommute uses Capacitor Geolocation to acquire our live GPS coordinates and renders them on an interactive Leaflet map. Key campus hubs are pinned. When we select a destination, such as Sumacab Campus, the application immediately plots the route line and computes the exact distance."*

#### 3. Standardized Fare Matrix Calculator (3:45 – 4:30)
- Open the Fare Calculator sheet.
- Toggle between **Tricycle (Shared)**, **Solo Trike**, **Traditional PUJ**, and **Modern PUJ**.
- Show the distance slider moving and the price updating dynamically.
- Click **Save Trip to History**.
- **Spoken Script:**
  > *"Here is our core Fare Matrix Calculator. It calculates fares strictly in accordance with Cabanatuan City Ordinance 050-2026 and LTFRB Region 3. For example, a 5-kilometer tricycle trip computes exactly ₱28.00 base for the first 3 kilometers, plus ₱10.00 for the succeeding 2 kilometers, giving ₱38.00. We can also compare Jeepneys, Taxis, or see walking calories. Clicking 'Save Trip' sends a POST request to our local MySQL database."*

#### 4. Digital Commuter Pass & History (4:30 – 5:00)
- Navigate to the **Profile** tab.
- Show the **Campus Commuter Pass** card and the trip history list.
- Demonstrate deleting a trip with the trash icon.
- **Spoken Script:**
  > *"In the Profile tab, the student's digital Commuter ID Pass is rendered with their course, formatted year level, and local DB synchronization status. Below, our logged commute history is loaded directly from MySQL via HTTP GET. We can also remove records with an instant HTTP DELETE."*

---

### Part 3: Technical Implementation & Code Snippets (5:00 – 8:00)
- **Screen:** VS Code editor showing the 3 code files.

#### Snippet 1: Fare Matrix Calculation Logic (`student.service.ts`)
- Highlight `calculateFare(distanceKm, mode, isSpecialTrip)`.
- **Spoken Script:**
  > *"For our first code snippet, let's examine `calculateFare()` inside `student.service.ts`. Here we implement the piecewise mathematical function required by Ordinance No. 050-2026. For regular tricycle trips, if distance is less than or equal to 3.0 km, the student base is ₱28.00. For each additional kilometer, we compute the excess distance and multiply by ₱5.00 per kilometer. The same logic is applied to LTFRB PUJ rates with the 20% student discount."*

#### Snippet 2: Capacitor Geolocation & Leaflet Map (`map.page.ts`)
- Highlight `initMap()` and `locateUser()`.
- **Spoken Script:**
  > *"Our second snippet demonstrates Capacitor Geolocation integration in `map.page.ts`. Using `@capacitor/geolocation`, we call `getCurrentPosition({ enableHighAccuracy: true })`. Once coordinates are resolved, we dynamically initialize the Leaflet map and position our animated custom SVG commuter pin."*

#### Snippet 3: Local RESTful MySQL Integration (`student.service.ts`)
- Highlight `fetchStudents()`, `saveTrip()`, and `deleteTrip()`.
- **Spoken Script:**
  > *"Our third snippet handles data operations using Angular's `HttpClient`. The service sends standard REST requests to our local PHP API running under XAMPP. `getCommuteTrips()` issues a GET request, `saveTrip()` dispatches a JSON POST payload, and `deleteTrip()` executes an HTTP DELETE query with PDO parameterized statements for database security."*

---

### Part 4: Testing, Usability Limitations & Future Work (8:00 – 9:30)
- **Screen:** Presentation slide showing the Testing Table.
- **Spoken Script:**
  > *"During our testing and evaluation phase, we executed eight primary test cases covering authentication, GPS pinpointing, fare calculation, and database CRUD operations—all of which passed successfully.*
  >
  > *In terms of usability limitations, our current version calculates distance using the Haversine straight-line formula, which is slightly shorter than actual winding road networks. Additionally, because the database is hosted on local XAMPP, running on physical Android devices requires pointing to the machine's local Wi-Fi IP.*
  >
  > *For future improvements, we plan to integrate OSRM street-routing vectors and add a QR code scanner for digital pass validation."*

---

### Part 5: AI Usage Disclosure & Conclusion (9:30 – 10:00)
- **Screen:** Slide showing AI Disclosure and conclusion.
- **Spoken Script:**
  > *"In accordance with course guidelines, we disclose that we utilized Google Antigravity as an AI development assistant to help scaffold TypeScript formulas, refactor generic HTML into official Ionic standalone components, and draft standard database connection templates. All AI-suggested code was thoroughly reviewed, debugged, and tested by our group to ensure complete system stability.*
  >
  > *Thank you very much, Sir Gel, and we hope TaraCommute serves as a valuable tool for our student commuter community!"*
