
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../core/services/product';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  products: Product[] = [];
  loading = false;
  errorMessage = '';
  categories: string[] = [
  'Laptops',
  'Mobiles',
  'Headphones',
  'Accessories'
];
  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';

    this.productService.getProducts().pipe(
      catchError((error) => {
        console.error('Home products error:', error);
        this.errorMessage = 'Unable to load products. Please try again.';
        return of({ success: false, count: 0, data: [] });
      }),
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe((response) => {
      if (response.success) {
        this.products = response.data.slice(0, 4);
      }
    });
  }
}
