import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Products } from './features/products/products';
import { Cart } from './features/cart/cart';
import { ProductDetails } from './features/product-details/product-details';
import { Register } from './features/auth/register/register';
import { Login } from './features/auth/login/login';
import { Checkout } from './features/checkout/checkout';
export const routes: Routes = [
{
    path: '',
    component: Home
  },
   { path: 'products', component: Products },
   { path: 'cart', component: Cart },
   { path: 'products/:id', component: ProductDetails },
   { path: 'login', component: Login },
   { path: 'register', component: Register },
   { path: 'checkout', component: Checkout },
];
