
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order, MyOrder } from '../../core/services/order';
import { RouterLink } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';

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
  private cdr = inject(ChangeDetectorRef);
  orders: MyOrder[] = [];
  loading = true;
  errorMessage = '';
  ngOnInit(): void {
    this.loadOrders();
  }
 loadOrders(): void {
  this.loading = true;
  this.errorMessage = '';

  this.orderService.getMyOrders().pipe(
    catchError((error) => {
      console.error('Error fetching orders:', error);

      this.errorMessage =
        error.error?.message || 'Unable to load your orders.';

      return of({ success: false, data: [] });
    }),
    finalize(() => {
      this.loading = false;
      this.cdr.detectChanges();
    })
  ).subscribe((response) => {
    if (response.success) {
      this.orders = response.data;
    }
  });
}
}