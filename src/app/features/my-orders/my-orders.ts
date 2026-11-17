
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order, MyOrder } from '../../core/services/order';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule
           , RouterLink,
  ],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css'
})
export class MyOrders implements OnInit {
  private orderService = inject(Order);
  orders: MyOrder[] = [];
  loading = true;
  errorMessage = '';
  ngOnInit(): void {
    this.loadOrders();
  }
  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';
    this.orderService.getMyOrders().subscribe({
      next: (response) => {
        this.loading = false;
        this.orders = response.data;   
        console.log('My Orders:', this.orders);
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
        this.errorMessage =
          error.error?.message || 'Unable to load your orders.';
        this.loading = false;
      }
    });
  }
}
