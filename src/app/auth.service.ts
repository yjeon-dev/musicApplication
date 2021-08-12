import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../environments/environment';

import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();

import { User } from './User';
import { RegisterUser } from './RegisterUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  public getToken(): string {
    return localStorage.getItem('access_token')!;
  }

  public readToken(): any {
    const token = localStorage.getItem('access_token');
    return helper.decodeToken(token!);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    if (helper.isTokenExpired(token!)) {
      return false;
    } else {
      return true;
    }
  }

  login(user: User): Observable<any> {
    return this.http.post<any>(`${environment.userAPIBase}/user/login`, user);
  }

  register(registerUser: RegisterUser): Observable<any> {
    return this.http.post<any>(
      `${environment.userAPIBase}/register`,
      registerUser
    );
  }
}