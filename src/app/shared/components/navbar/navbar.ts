import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../core/services/cart';
import { map } from 'rxjs';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,AsyncPipe,CommonModule,
RouterLink,
RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private cartService = inject(CartService);
  auth = inject(Auth);
cartCount$ = this.cartService.cartItems$.pipe(
  map(items =>
    items.reduce((total, item) => total + item.quantity, 0)
  )
);
}
