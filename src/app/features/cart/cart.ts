
import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartItem, CartService } from '../../core/services/cart';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {
  cartService = inject(CartService);
  cartItems$ = this.cartService.cartItems$;
 increaseQuantity(item: CartItem): void {
  this.cartService.updateQuantity(
    item.id,
    item.quantity + 1
  );
}
  decreaseQuantity(id: number, quantity: number): void {
    this.cartService.updateQuantity(id, quantity - 1);
  }
  removeItem(id: number): void {
    this.cartService.removeFromCart(id);
  }

}

