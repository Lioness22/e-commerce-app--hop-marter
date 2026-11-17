
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  quantity: number;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItemsSubject = new BehaviorSubject<CartItem[]>(
    JSON.parse(localStorage.getItem('cart') || '[]')
  );
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

  addToCart(
    product: Omit<CartItem, 'quantity'>,
    quantity: number = 1
  ): void {
    const existingItem = this.cartItems.find(
      item => item.id === product.id
    );
    if (product.stock <= 0) {
  alert('This product is out of stock.');
  return;
}

if (
  existingItem &&
  existingItem.quantity + quantity > product.stock
) {
  alert(`Only ${product.stock} units are available.`);
  return;
}

if (!existingItem && quantity > product.stock) {
  alert(`Only ${product.stock} units are available.`);
  return;
}

    const items = existingItem
      ? this.cartItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [...this.cartItems, { ...product, quantity }];

    this.saveCart(items);
  }
updateQuantity(id: number, quantity: number): void {
  const items = this.cartItems.map(item => {
    if (item.id === id) {
      return {
        ...item,
        quantity: Math.min(quantity, item.stock)
      };
    }
    return item;
  }).filter(item => item.quantity > 0);

  this.saveCart(items);
}

  removeFromCart(id: number): void {
    const items = this.cartItems.filter(
      item => item.id !== id
    );
    this.saveCart(items);
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

  private saveCart(items: CartItem[]): void {
    localStorage.setItem('cart', JSON.stringify(items));
    this.cartItemsSubject.next(items);
  }
  
}
