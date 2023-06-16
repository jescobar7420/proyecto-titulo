import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment.prod';
import { User } from '../interfaces/user';
import { SHA256 } from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = environment.baseUrl;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  register(user: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/register`, user);
  }

  login(user: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/login`, user)
      .pipe(tap((res: any) => {
        localStorage.setItem('access_token', res.token);
      }));
  }

  logout(): void {
    localStorage.removeItem('access_token');
  }

  public get loggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  public get userDetails(): User | null {
    const token = localStorage.getItem('access_token');
    if (token != null) {
      const tokenData = this.jwtHelper.decodeToken(token);
      return {
        name: tokenData.name,
        email: tokenData.email,
        password: ''
      };
    }
    return null;
  }

  public get userId(): number | null {
    const token = localStorage.getItem('access_token');
    if (token != null) {
      const tokenData = this.jwtHelper.decodeToken(token);
      return tokenData.id
    }

    return null;
  }

  postRecoverPassword(email: { email: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/recover-password`, email);
  }

  updatePassword(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/reset-password`, { email, password });
  }

  verifyRecoverCode(email: string, token: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/verify-reset-token`, { email, token });
  }
}
