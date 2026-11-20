
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/admin';
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/dashboard`
    );
  }
}

