
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart';
import { Order } from '../../core/services/order';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AsyncPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private orderService = inject(Order);
  cartService = inject(CartService);
  cartItems$ = this.cartService.cartItems$;
  loading = false;
  errorMessage = '';
  totalPrice$ = this.cartItems$.pipe(
    map(items =>
      items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      )
    )
  );

  checkoutForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    address: ['', Validators.required],
    city: ['', Validators.required],
    pincode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
  });

  placeOrder(): void {
    this.errorMessage = '';
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }
    const cartItems = this.cartService.cartItems;
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    const formData = this.checkoutForm.getRawValue();
    const shippingAddress = [
      `Name: ${formData.fullName}`,
      `Email: ${formData.email}`,
      `Phone: ${formData.phone}`,
      `Address: ${formData.address}`,
      `City: ${formData.city}`,
      `Pincode: ${formData.pincode}`
    ].join(', ');

    const orderData = {
      shippingAddress,
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))
    };
    this.loading = true;
    this.orderService.placeOrder(orderData).subscribe({
      next: (response) => {
        this.loading = false;
        // Clear cart only after successful order creation
        cartItems.forEach(item => {
          this.cartService.removeFromCart(item.id);
        });
        alert(
          `Order placed successfully! Order ID: ${response.data.id}`
        );
        this.router.navigate(['/']);
      },

      error: (error) => {
        this.loading = false;
        this.errorMessage =
          error.error?.message ||
          'Unable to place your order. Please try again.';
        console.error('Order creation error:', error);
      }
    });
  }
}
