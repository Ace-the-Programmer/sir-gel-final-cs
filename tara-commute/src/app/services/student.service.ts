import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Student {
  id?: number;
  student_no: string;
  full_name: string;
  course: string;
  year_level: number;
  created_at?: string;
  updated_at?: string;
}

export interface UserAccount {
  id?: number;
  student_no: string;
  username: string;
  password?: string;
  full_name: string;
  email: string;
  course: string;
  year_level: number;
  avatar?: string;
  created_at?: string;
}

export interface CommuteTrip {
  id?: number;
  student_no: string;
  mode: 'car' | 'tricycle' | 'bicycle' | 'walk' | string;
  origin: string;
  destination: string;
  distance_km: number;
  fare_amount: number;
  created_at?: string;
}

export interface CampusLocation {
  id?: number;
  name: string;
  category: string;
  latitude: number | string;
  longitude: number | string;
  distance_km: number | string;
}

export interface FareCalculationResult {
  mode: string;
  modeLabel: string;
  distanceKm: number;
  regularFare: number;
  discountAmount: number;
  studentFare: number;
  estMinutes: number;
  caloriesBurned?: number;
  steps?: number;
  breakdown: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  // Always and exclusively points to the XAMPP htdocs http-backend folder
  public readonly apiUrl: string = environment.apiUrl; // 'http://localhost/http-backend/api/students.php'
  public readonly apiBase: string = environment.apiBase || 'http://localhost/http-backend/api';

  private currentStudentSubject = new BehaviorSubject<Student | null>(null);
  public currentStudent$ = this.currentStudentSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<UserAccount | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Restore active student/user from localStorage if available
    const savedUser = localStorage.getItem('taracommute_active_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        this.currentUserSubject.next(parsed);
        this.currentStudentSubject.next({
          id: parsed.id,
          student_no: parsed.student_no,
          full_name: parsed.full_name,
          course: parsed.course,
          year_level: parsed.year_level
        });
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    } else {
      const savedStudent = localStorage.getItem('locarate_active_student');
      if (savedStudent) {
        try {
          this.currentStudentSubject.next(JSON.parse(savedStudent));
        } catch (e) {
          console.error('Error parsing stored student:', e);
        }
      }
    }
  }

  // Get current active localhost API endpoint
  public getApiUrl(): string {
    return this.apiUrl;
  }

  public getCurrentStudent(): Student | null {
    return this.currentStudentSubject.getValue();
  }

  public getCurrentUser(): UserAccount | null {
    return this.currentUserSubject.getValue();
  }

  public clearCurrentStudent(): void {
    this.clearSession();
  }

  // ==========================================
  // 1. TEACHER'S REST API (students.php)
  // ==========================================

  // CO3 Requirement: GET operation (Fetch all students from XAMPP htdocs/http-backend)
  public getStudents(): Observable<ApiResponse<Student[]>> {
    return this.http.get<ApiResponse<Student[]>>(this.apiUrl).pipe(
      catchError((error) => {
        console.error(`GET ${this.apiUrl} error:`, error);
        throw error;
      })
    );
  }

  // GET single student by ID
  public getStudentById(id: number): Observable<ApiResponse<Student>> {
    const url = `${this.apiUrl}?id=${id}`;
    return this.http.get<ApiResponse<Student>>(url).pipe(
      catchError((error) => {
        console.error(`GET ${url} error:`, error);
        throw error;
      })
    );
  }

  // CO3 Requirement: POST operation (Create new student in XAMPP htdocs/http-backend)
  public createStudent(payload: Student): Observable<ApiResponse<Student>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<ApiResponse<Student>>(this.apiUrl, payload, { headers }).pipe(
      tap((response) => {
        if (response && response.success) {
          const studentRecord = response.data || payload;
          this.setCurrentStudent(studentRecord);
        }
      }),
      catchError((error) => {
        console.error(`POST ${this.apiUrl} error:`, error);
        throw error;
      })
    );
  }

  // ==========================================
  // 2. REAL USERS & AUTH (auth.php)
  // ==========================================

  // Fetch all registered users from MySQL
  public getUsers(): Observable<ApiResponse<UserAccount[]>> {
    const url = `${this.apiBase}/auth.php?action=users`;
    return this.http.get<ApiResponse<UserAccount[]>>(url).pipe(
      catchError((error) => {
        console.error(`GET ${url} error:`, error);
        throw error;
      })
    );
  }

  // Login against MySQL database users table
  public login(credentials: { username: string; password: string }): Observable<ApiResponse<UserAccount>> {
    const url = `${this.apiBase}/auth.php?action=login`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ApiResponse<UserAccount>>(url, credentials, { headers }).pipe(
      tap((response) => {
        if (response && response.success && response.data) {
          this.setCurrentUser(response.data);
        }
      }),
      catchError((error) => {
        console.error(`POST ${url} error:`, error);
        throw error;
      })
    );
  }

  // Register real user in MySQL users table (and syncs to students table)
  public registerUser(payload: Partial<UserAccount>): Observable<ApiResponse<UserAccount>> {
    const url = `${this.apiBase}/auth.php?action=register`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ApiResponse<UserAccount>>(url, payload, { headers }).pipe(
      tap((response) => {
        if (response && response.success && response.data) {
          this.setCurrentUser(response.data);
        }
      }),
      catchError((error) => {
        console.error(`POST ${url} error:`, error);
        throw error;
      })
    );
  }

  // Set and persist current active user
  public setCurrentUser(user: UserAccount): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('taracommute_active_user', JSON.stringify(user));

    const student: Student = {
      id: user.id,
      student_no: user.student_no,
      full_name: user.full_name,
      course: user.course,
      year_level: user.year_level
    };
    this.setCurrentStudent(student);
  }

  // Update current active student session
  public setCurrentStudent(student: Student): void {
    this.currentStudentSubject.next(student);
    localStorage.setItem('locarate_active_student', JSON.stringify(student));
  }

  public clearSession(): void {
    this.currentUserSubject.next(null);
    this.currentStudentSubject.next(null);
    localStorage.removeItem('taracommute_active_user');
    localStorage.removeItem('locarate_active_student');
  }

  // ==========================================
  // 3. COMMUTE HISTORY (history.php)
  // ==========================================

  public getCommuteHistory(studentNo?: string): Observable<ApiResponse<CommuteTrip[]>> {
    const query = studentNo ? `?student_no=${encodeURIComponent(studentNo)}` : '';
    const url = `${this.apiBase}/history.php${query}`;
    return this.http.get<ApiResponse<CommuteTrip[]>>(url).pipe(
      catchError((error) => {
        console.error(`GET ${url} error:`, error);
        throw error;
      })
    );
  }

  public logTrip(trip: CommuteTrip): Observable<ApiResponse<CommuteTrip>> {
    const url = `${this.apiBase}/history.php`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ApiResponse<CommuteTrip>>(url, trip, { headers }).pipe(
      catchError((error) => {
        console.error(`POST ${url} error:`, error);
        throw error;
      })
    );
  }

  public deleteTrip(id: number): Observable<ApiResponse<null>> {
    const url = `${this.apiBase}/history.php?id=${id}`;
    return this.http.delete<ApiResponse<null>>(url).pipe(
      catchError((error) => {
        console.error(`DELETE ${url} error:`, error);
        throw error;
      })
    );
  }

  // ==========================================
  // 4. CAMPUS LOCATIONS (locations.php)
  // ==========================================

  public getCampusLocations(search?: string): Observable<ApiResponse<CampusLocation[]>> {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const url = `${this.apiBase}/locations.php${query}`;
    return this.http.get<ApiResponse<CampusLocation[]>>(url).pipe(
      catchError((error) => {
        console.error(`GET ${url} error:`, error);
        throw error;
      })
    );
  }

  // ==========================================
  // 5. CAMPUS FARE CALCULATOR (Cabanatuan City Ordinance & LTFRB Region 3)
  // ==========================================

  public calculateFare(distanceKm: number, mode: string = 'tricycle', applyStudentDiscount: boolean = true): FareCalculationResult {
    const dist = Math.max(0.1, Number(distanceKm) || 1.0);
    const m = (mode || 'tricycle').toLowerCase();

    let regularFare = 0;
    let studentFare = 0;
    let estMinutes = 0;
    let modeLabel = 'Cabanatuan Tricycle';
    let breakdown = '';
    let caloriesBurned = 0;
    let steps = 0;

    switch (m) {
      case 'tricycle': {
        modeLabel = 'Cabanatuan Tricycle (Shared)';
        // Cabanatuan City Ordinance No. 050-2026:
        // Base: ₱35 regular / ₱28 student for first 3 km
        // Succeeding km: ₱5.00/km (no further student discount on succeeding km)
        const extraKm = Math.max(0, dist - 3.0);
        regularFare = 35 + (extraKm * 5.0);
        studentFare = applyStudentDiscount ? (28 + (extraKm * 5.0)) : regularFare;
        estMinutes = Math.round(dist * 3.5 + 2);
        breakdown = 'Ord. No. 050-2026: ₱28 student base (first 3 km) + ₱5.00/km';
        break;
      }

      case 'tricycle-solo':
      case 'solo-tricycle':
      case 'special': {
        modeLabel = 'Solo Tricycle (Special Trip)';
        // Cabanatuan City Ordinance No. 050-2026:
        // Special Solo Trip: ₱56.00 student base for first 3 km
        const extraKm = Math.max(0, dist - 3.0);
        regularFare = 70 + (extraKm * 10.0);
        studentFare = applyStudentDiscount ? (56 + (extraKm * 10.0)) : regularFare;
        estMinutes = Math.round(dist * 3.0 + 1);
        breakdown = 'Ord. No. 050-2026: ₱56 student solo base (first 3 km) + ₱10/km';
        break;
      }

      case 'jeepney':
      case 'traditional-jeepney': {
        modeLabel = 'Traditional Jeepney (LTFRB R3)';
        // LTFRB Region 3 Matrix:
        // Regular: ₱14.00 base (first 4 km) + ₱2.00/km
        // Student: ₱11.25 base (first 4 km) + ₱1.60/km
        const extraKm = Math.max(0, dist - 4.0);
        regularFare = 14.0 + (extraKm * 2.0);
        studentFare = applyStudentDiscount ? (11.25 + (extraKm * 1.60)) : regularFare;
        estMinutes = Math.round(dist * 3.0 + 3);
        breakdown = 'LTFRB Region 3: ₱11.25 student base (first 4 km) + ₱1.60/km';
        break;
      }

      case 'modern-jeepney': {
        modeLabel = 'Modern Jeepney (LTFRB R3)';
        // LTFRB Region 3 Matrix:
        // Regular: ₱17.00 base (first 4 km) + ₱2.40/km
        // Student: ₱13.50 base (first 4 km) + ₱1.92/km
        const extraKm = Math.max(0, dist - 4.0);
        regularFare = 17.0 + (extraKm * 2.40);
        studentFare = applyStudentDiscount ? (13.50 + (extraKm * 1.92)) : regularFare;
        estMinutes = Math.round(dist * 2.8 + 2);
        breakdown = 'LTFRB Region 3: ₱13.50 student base (first 4 km) + ₱1.92/km';
        break;
      }

      case 'car':
      case 'taxi': {
        modeLabel = 'Car / Taxi';
        regularFare = 45.0 + (dist * 15.0);
        studentFare = applyStudentDiscount ? Math.round(regularFare * 0.9 * 100) / 100 : regularFare;
        estMinutes = Math.round(dist * 2.2 + 1);
        breakdown = 'Base ₱45.00 + ₱15.00/km (10% student promo)';
        break;
      }

      case 'bicycle': {
        modeLabel = 'Bicycle';
        regularFare = 15.0;
        studentFare = 15.0;
        estMinutes = Math.round(dist * 4.5);
        caloriesBurned = Math.round(dist * 35);
        breakdown = 'Flat student campus rate';
        break;
      }

      case 'walk': {
        modeLabel = 'Walking';
        regularFare = 0;
        studentFare = 0;
        estMinutes = Math.round(dist * 12);
        caloriesBurned = Math.round(dist * 60);
        steps = Math.round(dist * 1350);
        breakdown = 'Free Commute (Healthy Walk)';
        break;
      }

      default: {
        modeLabel = 'Cabanatuan Commute';
        const extraKm = Math.max(0, dist - 3.0);
        regularFare = 35 + (extraKm * 5.0);
        studentFare = applyStudentDiscount ? (28 + (extraKm * 5.0)) : regularFare;
        estMinutes = Math.round(dist * 3.5);
        breakdown = 'Ord. No. 050-2026: ₱28 base (3km) + ₱5/km';
      }
    }

    regularFare = Math.round(regularFare * 100) / 100;
    studentFare = Math.round(studentFare * 100) / 100;
    const discountAmount = Math.max(0, Math.round((regularFare - studentFare) * 100) / 100);

    return {
      mode: m,
      modeLabel,
      distanceKm: Math.round(dist * 100) / 100,
      regularFare,
      discountAmount,
      studentFare,
      estMinutes: Math.max(1, estMinutes),
      caloriesBurned,
      steps,
      breakdown,
    };
  }
}
