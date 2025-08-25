import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { User } from '../model/user.model';
import { environment } from '../../environments/environment'
import { catchError, firstValueFrom } from 'rxjs'
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Response } from '../model/response.model';

export interface JwtPayload {
  sub: string;
  isAdmin: boolean;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  apiUrl : string | undefined;
  private token: string | null = null;
  user = signal<JwtPayload |null> (null);
  private sessionTimeoutId?: number;
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  constructor(private http : HttpClient, private router: Router){
      this.apiUrl = environment.apiBaseUrl;
      const token = localStorage.getItem('jwt');
      if(token && this.isTokenValid(token)){
        this.setUser(token);
        this.startSessionTimeout();
      } else if (token) {
        // Token exists but is invalid, clear it
        this.clearUserData();
      }

      // Listen for user activity to reset session timeout
      this.setupActivityListeners();
  }

  async login(username: string, password: string): Promise<User>{
   // Input validation
   if (!username?.trim() || !password?.trim()) {
     throw new Error('Username and password are required');
   }

   const url = `${this.apiUrl}/login`;
   try{
      const userObj = {"username" : username.trim(), "password" : password};
      const response : Response = await firstValueFrom(
        this.http.post<Response>(url, userObj)
      );

      if (!response.data) {
        throw new Error('Invalid response: No token received');
      }

      const tokenStr : string = response.data;
      this.setToken(tokenStr);
      return this.createUser(tokenStr);
    }catch(error: any){
      console.error("Authentication failed:", error);

      // Provide more specific error messages
      if (error.status === 401) {
        throw new Error('Invalid username or password');
      } else if (error.status === 403) {
        throw new Error('Account is locked or suspended');
      } else if (error.status === 0) {
        throw new Error('Unable to connect to server');
      } else {
        throw new Error('Login failed. Please try again.');
      }
    }
  }

  setToken(token: string): void {
      localStorage.setItem('jwt', token);
      this.setUser(token);
      this.startSessionTimeout();
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  /*async logout(callServer: boolean = true): Promise<void> {
    if (callServer) {
      try {
        // Call server logout endpoint to invalidate token
        const url = `${this.apiUrl}/logout`;
        await firstValueFrom(this.http.post(url, {}));
      } catch (error) {
        console.warn('Server logout failed:', error);
        // Continue with local logout even if server call fails
      }
    }

    this.clearUserData();
    this.router.navigate(['/login']);
  }*/

  logout(): void {
    this.token = null;
    this.user.set(null);
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }
    
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const payload = jwtDecode<JwtPayload>(token);
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch {
      return false;
    }
  }

  isTokenExpiringSoon(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = jwtDecode<JwtPayload>(token);
      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = payload.exp - now;
      // Return true if token expires in less than 5 minutes
      return timeUntilExpiry < 300;
    } catch {
      return true;
    }
  }

  async refreshToken(): Promise<boolean> {
    const url = `${this.apiUrl}/refresh`;
    try {
      const response: Response = await firstValueFrom(
        this.http.post<Response>(url, {})
      );

      if (response.data) {
        this.setToken(response.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.logout();
      return false;
    }
  }

  private setUser(token: string) {
    try {
      const payload = jwtDecode<JwtPayload>(token);
      console.log("payload", payload);
      this.user.set(payload);
    } catch (err) {
      console.error('Failed to decode JWT:', err);
      this.user.set(null);
    }
  }

  private createUser(tokenStr: string){
    const user : User = {token: "", isAdmin: false};
    try {
      const payload = jwtDecode<JwtPayload>(tokenStr);
      user.token = tokenStr;
      user.isAdmin = payload.isAdmin;
      return user;
    } catch (err) {
      console.error('Failed to decode JWT:', err);
      throw err;
    }
  }

  // User role and permission methods
  getCurrentUser(): JwtPayload | null {
    return this.user();
  }

  getCurrentUsername(): string | null {
    const user = this.getCurrentUser();
    return user ? user.sub : null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user ? user.isAdmin : false;
  }

  hasPermission(permission: string): boolean {
    // Extend this based on your permission system
    const user = this.getCurrentUser();
    if (!user) return false;

    // For now, admins have all permissions
    if (user.isAdmin) return true;

    // Add more specific permission logic here based on the permission parameter
    // Example: check if user has specific permission in their roles/permissions array
    console.log(`Checking permission: ${permission} for user: ${user.sub}`);
    return false;
  }

  // Security utilities
  clearUserData(): void {
    this.user.set(null);
    localStorage.removeItem('jwt');
    localStorage.removeItem('refreshToken'); // if you implement refresh tokens
    this.clearSessionTimeout();
  }

  private isTokenValid(token: string): boolean {
    try {
      const payload = jwtDecode<JwtPayload>(token);
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch {
      return false;
    }
  }

  private startSessionTimeout(): void {
    this.clearSessionTimeout();
    this.sessionTimeoutId = window.setTimeout(() => {
      console.warn('Session timeout - logging out user');
      this.logout(); // Don't call server on timeout
    }, this.SESSION_TIMEOUT);
  }

  private clearSessionTimeout(): void {
    if (this.sessionTimeoutId) {
      clearTimeout(this.sessionTimeoutId);
      this.sessionTimeoutId = undefined;
    }
  }

  private setupActivityListeners(): void {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const resetTimeout = () => {
      if (this.isAuthenticated()) {
        this.startSessionTimeout();
      }
    };

    events.forEach(event => {
      document.addEventListener(event, resetTimeout, true);
    });
  }


}
