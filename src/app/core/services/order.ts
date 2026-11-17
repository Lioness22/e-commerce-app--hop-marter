
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

export interface MyOrder {
  id: number;
  total_amount: string;
  status: string;
  shipping_address: string;
  created_at: string;
  total_items: number;
}

export interface OrderDetailItem {
  product_id: number;
  name: string;
  image: string;
  quantity: number;
  price: string;
  subtotal: string;
}

export interface OrderDetails {
  id: number;
  user_id: number;
  total_amount: string;
  status: string;
  shipping_address: string;
  created_at: string;
  items: OrderDetailItem[];
}

@Injectable({
  providedIn: 'root'
})
export class Order {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/orders';

  // Place a new order
  placeOrder(orderData: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(
      this.apiUrl,
      orderData
    );
  }

  // Get logged-in user's orders
  getMyOrders(): Observable<{
    success: boolean;
    count: number;
    data: MyOrder[];
  }> {
    return this.http.get<{
      success: boolean;
      count: number;
      data: MyOrder[];
    }>(`${this.apiUrl}/my-orders`);
  }

  // Get individual order details
  getOrderDetails(orderId: number): Observable<{
    success: boolean;
    data: OrderDetails;
  }> {
    return this.http.get<{
      success: boolean;
      data: OrderDetails;
    }>(`${this.apiUrl}/${orderId}`);
  }
}
