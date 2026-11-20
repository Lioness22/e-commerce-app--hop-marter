
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: number;
    fullName: string;
    email: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private http = inject(HttpClient);

  private apiUrl = 'https://e-commerce-app-hop-marter-3.onrender.com/api/api/users';

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      { email, password }
    ).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  getUser(): LoginResponse['user'] | null {
  const user = localStorage.getItem('user');

  return user ? JSON.parse(user) : null;
}

isAdmin(): boolean {
  return this.getUser()?.role === 'admin';
}

isLoggedIn(): boolean {
  return !!this.getToken();
}
}
