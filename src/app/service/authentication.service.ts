import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/user.model';
import { environment } from '../../environments/environment'
import { firstValueFrom } from 'rxjs'
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  apiUrl : string | undefined;
  private token: string | null = null;

  constructor(private http : HttpClient, private router: Router){
      this.apiUrl = environment.apiBaseUrl;
  }

  async login(username: string, password: string): Promise<User>{
   const url = `${this.apiUrl}/login`;
   try{
      const user = await firstValueFrom(
        this.http.post<User>(username, password)
      );
      console.log(user);
      return user;
    }catch(error){
      console.log("Cannot authenticate ", error);
      throw error;
    }
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('access_token');
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
  
}
