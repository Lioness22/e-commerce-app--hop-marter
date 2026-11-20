
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminOrders {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/admin';
  getAllOrders(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/orders`);
  }
  updateOrderStatus(orderId: number,status: string): Observable<any> {
  return this.http.patch<any>(
    `${this.apiUrl}/orders/${orderId}/status`,
    { status }
  );
}

getOrderDetails(orderId: number): Observable<any> {
  return this.http.get<any>(
    `${this.apiUrl}/orders/${orderId}`
  );
}

}
