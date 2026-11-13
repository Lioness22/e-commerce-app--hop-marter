
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);

  cartItems$ = this.cartItemsSubject.asObservable();

  get cartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }
  totalItems$ = this.cartItems$.pipe(
    map(items =>
      items.reduce((total, item) => total + item.quantity, 0)
    )
  );

  totalPrice$ = this.cartItems$.pipe(
    map(items =>
      items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      )
    )
  );
  // addToCart(product: Omit<CartItem, 'quantity'>): void {
  //   const items = [...this.cartItems];

  //   const existingItem = items.find(
  //     item => item.id === product.id
  //   );

  //   if (existingItem) {
  //     existingItem.quantity++;
  //   } else {
  //     items.push({ ...product, quantity: 1 });
  //   }

  //   this.cartItemsSubject.next(items);
  // }
addToCart(
  product: Omit<CartItem, 'quantity'>,
  quantity: number = 1
): void {
  const existingItem = this.cartItems.find(
    item => item.id === product.id
  );

  const items = existingItem
    ? this.cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      )
    : [...this.cartItems, { ...product, quantity }];

  this.cartItemsSubject.next(items);
}
  updateQuantity(id: number, quantity: number): void {
    const items = this.cartItems
      .map(item =>
        item.id === id ? { ...item, quantity } : item
      )
      .filter(item => item.quantity > 0);

    this.cartItemsSubject.next(items);
  }

  removeFromCart(id: number): void {
    const items = this.cartItems.filter(
      item => item.id !== id
    );

    this.cartItemsSubject.next(items);
  }

  getTotalItems(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.quantity, 0
    );
  }

  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity, 0
    );
  }
}
