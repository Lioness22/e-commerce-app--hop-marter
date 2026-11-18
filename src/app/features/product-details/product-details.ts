
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService, Product } from '../../core/services/product';
import { CartService } from '../../core/services/cart';
import { catchError, finalize, of } from 'rxjs';
import { ToastService } from '../../core/services/toast';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {

  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);
  private toastService = inject(ToastService);
  product: Product | null = null;
  loading = true;
  errorMessage = '';
  quantity = 1;
  showToast = false;
  toastMessage = '';
  ngOnInit(): void {
    const productId = Number(
      this.route.snapshot.paramMap.get('id')
    );
    if (!Number.isSafeInteger(productId) || productId <= 0) {
      this.errorMessage = 'Invalid product ID.';
      this.loading = false;
      return;
    }

  //   this.productService.getProductById(productId).subscribe({
  //     next: (response) => {
  //       this.product = response.data;
  //       this.loading = false;
  //     },
  //     error: (error) => {
  //       console.error('Product details error:', error);
  //       this.errorMessage =
  //         error.error?.message || 'Unable to load product details.';
  //       this.loading = false;
  //     }
  //   });
  // }

this.loading = true;
this.errorMessage = '';

this.productService.getProductById(productId).pipe(
  catchError((error) => {
    console.error('Product details error:', error);

    this.errorMessage =
      error.error?.message || 'Unable to load product details.';

    return of(null);
  }),

  finalize(() => {
    this.loading = false;
    this.cdr.detectChanges();
  })
).subscribe((response) => {
  if (response?.success) {
    this.product = response.data;
    console.log('Product details fetched successfully:', this.product);
  }
});
  }
  addToCart(): void {
    if (!this.product) return;
    this.cartService.addToCart({
      id: this.product.id,
      name: this.product.name,
      price: this.product.price,
      category: this.product.category,
      image: this.product.image,
      stock: this.product.stock
    }, this.quantity);
   
   this.toastService.success(
  `${this.product.name} added to cart!`
);
  }

increaseQuantity(): void {
  if (this.product && this.quantity < this.product.stock) {
    this.quantity++;
  }
}
decreaseQuantity(): void {
  if (this.quantity > 1) {
    this.quantity--;
  }
}

}
