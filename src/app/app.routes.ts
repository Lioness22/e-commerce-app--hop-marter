import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Products } from './features/products/products';
import { Cart } from './features/cart/cart';
import { ProductDetails } from './features/product-details/product-details';
import { Register } from './features/auth/register/register';
import { Login } from './features/auth/login/login';
import { Checkout } from './features/checkout/checkout';
import { authGuard } from './core/guards/auth-guard';
import { MyOrders } from './features/my-orders/my-orders';
import { OrderDetailsComponent } from './features/order-details/order-details';
import { AiChat } from './features/ai-chat/ai-chat';
import { adminGuard } from './features/admin/guards/admin-guard';
import { AdminDashboard } from './features/admin/components/admin-dashboard/admin-dashboard';
import { AdminOrdersComponent } from './features/admin/components/admin-orders/admin-orders';
import { AdminOrderDetails } from './features/admin/components/admin-order-details/admin-order-details';
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
   { path: 'checkout', component: Checkout ,
    canActivate: [authGuard]
   },
   {
  path: 'my-orders',
  component: MyOrders,
  canActivate: [authGuard]
},
{
  path: 'orders/:id',
  component: OrderDetailsComponent,
  canActivate: [authGuard]
},

{
  path: 'ai-chat',
  component: AiChat
},
{
  path: 'admin',
  component: AdminDashboard,
  canActivate: [adminGuard]
},
{
  path: 'admin/orders',
  component: AdminOrdersComponent,
  canActivate: [adminGuard]
},
{
  path: 'admin/orders/:id',
  component: AdminOrderDetails,
  canActivate: [adminGuard]
}

];
