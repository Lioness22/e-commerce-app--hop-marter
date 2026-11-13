import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart';
import { PRODUCTS, Product } from '../../core/data/products';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails {
  private route = inject(ActivatedRoute);
  private cartService = inject(CartService);

  product: Product | undefined;

  quantity = 1;

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.product = PRODUCTS.find(item => item.id === id);
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product) {
      return;
    }

    this.cartService.addToCart(this.product, this.quantity);

    alert(this.product.name + ' added to cart!');
  }
}