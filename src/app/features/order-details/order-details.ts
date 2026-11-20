
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Order, OrderDetails } from '../../core/services/order';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css'
})
export class OrderDetailsComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private orderService = inject(Order);
  private cdr = inject(ChangeDetectorRef);
  order: OrderDetails | null = null;
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
   this.route.paramMap.subscribe(params => {
    const orderId = Number(params.get('id'));

    if (!Number.isSafeInteger(orderId) || orderId <= 0) {
      this.order = null;
      this.loading = false;
      this.errorMessage = 'Invalid order ID.';
      return;
    }

    this.loadOrderDetails(orderId);
  });
  }

  loadOrderDetails(orderId: number): void {
  this.loading = true;
  this.errorMessage = '';
  this.order = null;

  this.orderService.getOrderDetails(orderId)
    .pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    )
    .subscribe({
      next: (response) => {
        this.order = response.data;
        console.log('Order details:', this.order);
      },
      error: (error) => {
        console.error('Order details error:', error);

        this.errorMessage =
          error.error?.message || 'Unable to load order details.';
      }
    });
}
}

