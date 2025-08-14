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

  constructor(private http : HttpClient, private router: Router){
      this.apiUrl = environment.apiBaseUrl;
      const token = localStorage.getItem('jwt');
      if(token){
        this.setUser(token);
      }
  }

  async login(username: string, password: string): Promise<User>{
   const url = `${this.apiUrl}/login`;
   try{
      const userObj = {"username" : username, "password" : password};
      const response : Response= await firstValueFrom(
        this.http.post<Response>(url, userObj)
      );

      const tokenStr : string = response.data;
      this.setToken(tokenStr);
      return this.createUser(tokenStr);
    }catch(error){
      console.log("Cannot authenticate ", error);
      throw error;
    }
  }

  setToken(token: string): void {
      localStorage.setItem('jwt', token);
      this.setUser(token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('access_token');
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

  
}
