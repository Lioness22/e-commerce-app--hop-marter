
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminOrders } from '../../services/admin-orders';

@Component({
  selector: 'app-admin-order-details',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './admin-order-details.html',
  styleUrl: './admin-order-details.css'
})
export class AdminOrderDetails implements OnInit {

  private route = inject(ActivatedRoute);
  private adminOrders = inject(AdminOrders);
  private cdr = inject(ChangeDetectorRef);

  order: any = null;
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    const orderId = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(orderId) || orderId <= 0) {
      this.errorMessage = 'Invalid order ID.';
      this.loading = false;
      return;
    }

    this.adminOrders.getOrderDetails(orderId).subscribe({
      next: (response) => {
        this.order = response.data;
        this.loading = false;
         this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Order details error:', error);
        this.errorMessage = 'Unable to load order details.';
        this.loading = false;
      }
    });
  }
}
