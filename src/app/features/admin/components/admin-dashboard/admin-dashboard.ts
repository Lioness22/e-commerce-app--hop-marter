
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule ,CurrencyPipe } from '@angular/common';
import { AdminService } from '../../services/admin';

interface DashboardStats {
  total_orders: number;
  total_sales: number;
  pending_orders: number;
  total_customers: number;
  total_products: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule,CurrencyPipe],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  private adminService = inject(AdminService);
  private cdr = inject(ChangeDetectorRef);
  stats: DashboardStats | null = null;
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.cdr.detectChanges();
    this.loading = true;
    this.errorMessage = '';
    this.adminService.getDashboardStats().subscribe({
      next: (response) => {
        this.loading = false;
        this.stats = response.data;
         this.cdr.detectChanges();
        
      },
      error: (error) => {
        console.error('Dashboard API error:', error);
        this.errorMessage = 'Unable to load dashboard statistics.';
        this.loading = false;
      }
    });
  }
}

