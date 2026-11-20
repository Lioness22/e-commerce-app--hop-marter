
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { AdminOrders } from '../../services/admin-orders';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe,
    FormsModule,RouterLink,
  ],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css'
})
export class AdminOrdersComponent implements OnInit {

  private adminOrders = inject(AdminOrders);
  private cdr = inject(ChangeDetectorRef);
  orders: any[] = [];
  loading = true;
  errorMessage = '';
  searchText = '';
  selectedStatus = 'all';
  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.cdr.detectChanges();
    this.errorMessage = '';
    this.adminOrders.getAllOrders().subscribe({
      next: (response) => {
         this.loading = false;
         this.orders = response.data;
          this.cdr.detectChanges();
         console.log('Orders loaded:', this.orders);
      },
      error: (error) => {
        console.error('Orders API error:', error);
        this.errorMessage = 'Unable to load orders.';
        this.loading = false;
      }
    });
  }
  get filteredOrders(): any[] {
  return this.orders.filter(order => {
    const search = this.searchText.toLowerCase();

    const matchesSearch =
      String(order.id).includes(search) ||
      order.customer_name.toLowerCase().includes(search) ||
      order.customer_email.toLowerCase().includes(search);

    const matchesStatus =
      this.selectedStatus === 'all' ||
      order.status.toLowerCase() === this.selectedStatus;

    return matchesSearch && matchesStatus;
  });
}

updateStatus(order: any, event: Event): void {
  const select = event.target as HTMLSelectElement;
  const newStatus = select.value;
  const previousStatus = order.status;
  if (newStatus === previousStatus) {
     return;
  };
  console.log('3. Calling updateOrderStatus service');
  this.adminOrders.updateOrderStatus(order.id, newStatus)
    .subscribe({
      next: (response) => {
        order.status = response.data.status;
      },
      error: (error) => {
        select.value = previousStatus;
      }
    });
}
}
