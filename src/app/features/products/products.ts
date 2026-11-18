
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { CartService } from '../../core/services/cart';
import { ProductService, Product } from '../../core/services/product';
import {  OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule,RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css'
})

export class Products {
private cartService = inject(CartService);
private productService = inject(ProductService);
private cdr = inject(ChangeDetectorRef);
private toastTimeout?: ReturnType<typeof setTimeout>;
  showToast = false;
  toastMessage = '';
  searchText = '';
  selectedCategory = 'All';
  products: Product[] = [];
  loading = true;
  errorMessage = '';
  categories = [
    'All',
    'Laptops',
    'Mobiles',
    'Headphones',
    'Accessories'
  ];

ngOnInit(): void {
//   this.productService.getProducts().subscribe({
//     next: (response) => {
//       this.loading = false;
//       this.products = response.data;
//       this.cdr.detectChanges();
//       console.log('Products fetched successfully:', this.products);
      
//     },
//     error: (error) => {
//       console.error('Error fetching products:', error);
//       this.errorMessage = 'Unable to load products. Please try again.';
//       this.loading = false;
//     }
//   });
// }
this.productService.getProducts().pipe(
  catchError((error) => {
    console.error('Error fetching products:', error);
    this.errorMessage = 'Unable to load products. Please try again.';
    return of({ success: false, count: 0, data: [] });
  }),
  finalize(() => {
    this.loading = false;
    this.cdr.detectChanges();
  })
).subscribe((response) => {
  if (response.success) {
    this.products = response.data;
    console.log('Products fetched successfully:', this.products);
  }
});
}
  
  get filteredProducts() {
    return this.products.filter(product => {
      const matchesCategory =
        this.selectedCategory === 'All' ||
        product.category === this.selectedCategory;

      const matchesSearch =
        product.name.toLowerCase().includes(
          this.searchText.toLowerCase()
        );

      return matchesCategory && matchesSearch;
    });
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

 addToCart(product: any): void {
  this.cartService.addToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    category: product.category,
    image: product.image,
    stock: product.stock
  });

  this.showSuccessToast(`${product.name} added to cart!`);
}

showSuccessToast(message: string): void {
  this.toastMessage = message;
  this.showToast = true;

  // Clear previous timer
  if (this.toastTimeout) {
    clearTimeout(this.toastTimeout);
  }

  // Hide toast after 3 seconds
  this.toastTimeout = setTimeout(() => {
    this.showToast = false;
    this.toastTimeout = undefined;
  }, 0);
}
}
