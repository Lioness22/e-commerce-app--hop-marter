
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface OrderRequest {
  shippingAddress: string;
  items: OrderItemRequest[];
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    user_id: number;
    total_amount: string;
    shipping_address: string;
    status: string;
    created_at: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class Order {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/orders';
  placeOrder(orderData: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(
      this.apiUrl,
      orderData
    );
  }
}
