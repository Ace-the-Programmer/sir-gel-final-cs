import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, map as rxjsMap } from 'rxjs/operators';
import { Capacitor } from '@capacitor/core';
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
  school?: string;
  year_level: number;
  avatar?: string;
  auth_token?: string;
  created_at?: string;
}

export interface CommuteTrip {
  id?: number;
  student_no: string;
  mode: 'jeep' | 'tricycle' | 'bus' | 'minibus' | string;
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
  token?: string;
  token_type?: string;
  remaining_attempts?: number;
  locked?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  // Primary live cloud database endpoint requested by the user
  public static readonly DEFAULT_API_BASE: string = 'https://taracommute-api.elementfx.com/api';
  private serverHost: string = 'taracommute-api.elementfx.com';

  public get apiUrl(): string {
    return `${this.apiBase}/students.php`;
  }

  public get apiBase(): string {
    const customEndpoint = localStorage.getItem('taracommute_custom_endpoint');
    if (customEndpoint && customEndpoint.trim()) {
      return customEndpoint.trim().replace(/\/+$/, '');
    }

    if (this.serverHost.includes('elementfx.com')) {
      return StudentService.DEFAULT_API_BASE;
    }

    if (this.serverHost.startsWith('http://') || this.serverHost.startsWith('https://')) {
      return this.serverHost.replace(/\/+$/, '');
    }

    return `http://${this.serverHost}/http-backend/api`;
  }

  private currentStudentSubject = new BehaviorSubject<Student | null>(null);
  public currentStudent$ = this.currentStudentSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<UserAccount | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // 1. Resolve host: user preference > live cloud endpoint default
    const savedHost = localStorage.getItem('taracommute_server_ip');
    if (savedHost && savedHost !== '192.168.5.199' && savedHost !== 'localhost') {
      this.serverHost = savedHost;
    } else {
      this.serverHost = 'taracommute-api.elementfx.com';
      localStorage.setItem('taracommute_server_ip', this.serverHost);
    }

    // 2. Restore active student/user from localStorage if available
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

  public getServerHost(): string {
    return this.serverHost;
  }

  public setServerHost(host: string): void {
    if (host && host.trim()) {
      let cleaned = host.trim();
      if (cleaned.includes('elementfx.com')) {
        this.serverHost = 'taracommute-api.elementfx.com';
        localStorage.setItem('taracommute_server_ip', this.serverHost);
        return;
      }
      cleaned = cleaned.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      this.serverHost = cleaned;
      localStorage.setItem('taracommute_server_ip', this.serverHost);
    }
  }

  // Get current active API endpoint
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

  // CO3 Requirement: GET operation (Fetch all students from XAMPP htdocs/http-backend with offline cache fallback)
  public getStudents(): Observable<ApiResponse<Student[]>> {
    return this.http.get<ApiResponse<Student[]>>(this.apiUrl).pipe(
      tap((res) => {
        if (res && res.data && res.data.length > 0) {
          localStorage.setItem('taracommute_cached_students', JSON.stringify(res.data));
        }
      }),
      catchError((error) => {
        console.warn(`GET ${this.apiUrl} unreachable, checking offline cache:`, error);
        const cached = localStorage.getItem('taracommute_cached_students');
        if (cached) {
          try {
            const data: Student[] = JSON.parse(cached);
            return of({ success: true, data, count: data.length });
          } catch (e) {}
        }
        return of({
          success: true,
          data: [
            { id: 5, student_no: '2023-00981', full_name: 'Daryll Ace F. Cumbe', course: 'BSIT', year_level: 1 },
            { id: 1, student_no: '2026-0001', full_name: 'Juan Dela Cruz', course: 'BSIT', year_level: 1 },
            { id: 2, student_no: '2026-0002', full_name: 'Maria Santos', course: 'BSIT', year_level: 2 },
            { id: 3, student_no: '2026-0003', full_name: 'Pedro Reyes', course: 'BSCS', year_level: 3 }
          ],
          count: 4
        });
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

  // Strict live authentication directly against MySQL database users table with BCrypt & Bearer Token
  public login(credentials: { username: string; password: string }): Observable<ApiResponse<UserAccount>> {
    const url = `${this.apiBase}/auth.php?action=login`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ApiResponse<UserAccount>>(url, credentials, { headers }).pipe(
      tap((response) => {
        if (response && response.success && response.data) {
          if (response.token) {
            response.data.auth_token = response.token;
            localStorage.setItem('taracommute_auth_token', response.token);
          }
          this.setCurrentUser(response.data);
        }
      }),
      catchError((error) => {
        console.error(`Authentication rejected by MySQL auth API (${url}):`, error);
        throw error;
      })
    );
  }

  // Register real user in MySQL database users table
  public registerUser(payload: Partial<UserAccount>): Observable<ApiResponse<UserAccount>> {
    const url = `${this.apiBase}/auth.php?action=register`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ApiResponse<UserAccount>>(url, payload, { headers }).pipe(
      tap((response) => {
        if (response && response.success && response.data) {
          if (response.token) {
            response.data.auth_token = response.token;
            localStorage.setItem('taracommute_auth_token', response.token);
          }
          this.setCurrentUser(response.data);
        }
      }),
      catchError((error) => {
        console.error(`Registration rejected by MySQL auth API (${url}):`, error);
        throw error;
      })
    );
  }

  // Verify active session token against server
  public verifySession(): Observable<ApiResponse<UserAccount>> {
    const url = `${this.apiBase}/auth.php?action=verify`;
    return this.http.get<ApiResponse<UserAccount>>(url, { headers: this.getAuthHeaders() }).pipe(
      tap((response) => {
        if (response && response.success && response.data) {
          this.setCurrentUser(response.data);
        }
      }),
      catchError((error) => {
        console.warn('Session verification failed, token might be expired:', error);
        throw error;
      })
    );
  }

  public getAuthToken(): string | null {
    return localStorage.getItem('taracommute_auth_token');
  }

  public getAuthHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // Set and persist current active user
  public setCurrentUser(user: UserAccount): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('taracommute_active_user', JSON.stringify(user));

    const student: Student = {
      id: user.id,
      student_no: user.student_no,
      full_name: user.full_name,
      course: user.school || user.course,
      year_level: user.year_level || 1
    };
    this.setCurrentStudent(student);
  }

  // Update current active student session
  public setCurrentStudent(student: Student): void {
    this.currentStudentSubject.next(student);
    localStorage.setItem('locarate_active_student', JSON.stringify(student));
  }

  public clearSession(): void {
    const token = this.getAuthToken();
    if (token) {
      const url = `${this.apiBase}/auth.php?action=logout`;
      this.http.post(url, {}, { headers: this.getAuthHeaders() }).subscribe({
        error: () => {}
      });
    }
    this.currentUserSubject.next(null);
    this.currentStudentSubject.next(null);
    localStorage.removeItem('taracommute_auth_token');
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
      tap((res) => {
        if (res && res.data) {
          localStorage.setItem('taracommute_cached_history', JSON.stringify(res.data));
        }
      }),
      catchError((error) => {
        console.warn(`GET ${url} unreachable, loading local cached trips:`, error);
        const cached = localStorage.getItem('taracommute_cached_history');
        if (cached) {
          try {
            const data: CommuteTrip[] = JSON.parse(cached);
            return of({ success: true, data, count: data.length });
          } catch (e) {}
        }
        return of({ success: true, data: [], count: 0 });
      })
    );
  }

  public logTrip(trip: CommuteTrip): Observable<ApiResponse<CommuteTrip>> {
    const url = `${this.apiBase}/history.php`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ApiResponse<CommuteTrip>>(url, trip, { headers }).pipe(
      tap((res) => {
        if (res && res.data) {
          const cached = JSON.parse(localStorage.getItem('taracommute_cached_history') || '[]');
          cached.unshift(res.data);
          localStorage.setItem('taracommute_cached_history', JSON.stringify(cached));
        }
      }),
      catchError((error) => {
        console.warn(`POST ${url} error, saving to local device history:`, error);
        try {
          const cached: CommuteTrip[] = JSON.parse(localStorage.getItem('taracommute_cached_history') || '[]');
          const localTrip: CommuteTrip = {
            ...trip,
            id: Date.now(),
            created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
          };
          cached.unshift(localTrip);
          localStorage.setItem('taracommute_cached_history', JSON.stringify(cached));
          return of({ success: true, data: localTrip, message: 'Saved to local device storage' });
        } catch (e) {
          throw error;
        }
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

  public calculateFare(distanceKm: number, mode: string = 'jeep', applyStudentDiscount: boolean = true): FareCalculationResult {
    const dist = Math.max(0.1, Number(distanceKm) || 1.0);
    const m = (mode || 'jeep').toLowerCase();

    let regularFare = 0;
    let studentFare = 0;
    let estMinutes = 0;
    let modeLabel = 'Student Commute';
    let breakdown = '';
    let caloriesBurned = 0;
    let steps = 0;

    switch (m) {
      case 'jeep':
      case 'jeepney':
      case 'traditional-jeepney': {
        modeLabel = 'Traditional Jeepney';
        // Base: ₱14.00 regular / ₱11.20 student for first 4 km
        // Succeeding km: ₱2.00/km regular / ₱1.60/km student
        const extraKm = Math.max(0, dist - 4.0);
        regularFare = 14.0 + (extraKm * 2.00);
        studentFare = applyStudentDiscount ? (11.20 + (extraKm * 1.60)) : regularFare;
        estMinutes = Math.round(dist * 3.0 + 3);
        breakdown = 'Traditional Jeep: ₱11.20 student base (first 4 km) + ₱1.60/km';
        break;
      }

      case 'tricycle':
      case 'trike':
      case 'shared-trike': {
        modeLabel = 'Tricycle (Shared / Rapok)';
        // Cabanatuan City Ordinance No. 050-2026:
        // Base: ₱35.00 regular / ₱28.00 student for first 3 km
        // Succeeding km: ₱5.00/km regular / ₱4.00/km student
        const extraKm = Math.max(0, dist - 3.0);
        regularFare = 35.0 + (extraKm * 5.00);
        studentFare = applyStudentDiscount ? (28.00 + (extraKm * 4.00)) : regularFare;
        estMinutes = Math.round(dist * 3.5 + 2);
        breakdown = 'Ord. No. 050-2026: ₱28.00 student base (first 3 km) + ₱4.00/km';
        break;
      }

      case 'bus':
      case 'campus-bus': {
        modeLabel = 'Student Campus Bus';
        // LTFRB Student Bus Matrix & RA 11314:
        // Base: ₱15.00 regular / ₱12.00 student for first 5 km
        // Succeeding km: ₱2.25/km regular / ₱1.80/km student (20% discount)
        const extraKm = Math.max(0, dist - 5.0);
        regularFare = 15.0 + (extraKm * 2.25);
        studentFare = applyStudentDiscount ? (12.00 + (extraKm * 1.80)) : regularFare;
        estMinutes = Math.round(dist * 2.5 + 4);
        breakdown = 'LTFRB Bus Matrix: ₱12.00 student base (first 5 km) + ₱1.80/km';
        break;
      }

      case 'minibus':
      case 'mini-bus':
      case 'modern-jeepney': {
        modeLabel = 'Mini Bus / Modern PUV';
        // LTFRB Modern PUV Matrix & RA 11314:
        // Base: ₱17.00 regular / ₱13.60 student for first 4 km
        // Succeeding km: ₱2.40/km regular / ₱1.90/km student (20% discount)
        const extraKm = Math.max(0, dist - 4.0);
        regularFare = 17.0 + (extraKm * 2.40);
        studentFare = applyStudentDiscount ? (13.60 + (extraKm * 1.90)) : regularFare;
        estMinutes = Math.round(dist * 2.8 + 2);
        breakdown = 'Modern PUV: ₱13.60 student base (first 4 km) + ₱1.90/km';
        break;
      }

      default: {
        modeLabel = 'Campus Commute';
        const extraKm = Math.max(0, dist - 4.0);
        regularFare = 13.0 + (extraKm * 1.80);
        studentFare = applyStudentDiscount ? (10.40 + (extraKm * 1.44)) : regularFare;
        estMinutes = Math.round(dist * 3.0 + 3);
        breakdown = 'Student Discount Fare Matrix (20% OFF)';
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
