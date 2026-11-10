import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  categories = [
    'Laptops',
    'Mobiles',
    'Headphones',
    'Accessories'
  ];

  products = [
    {
      id: 1,
      name: 'Premium Laptop',
      price: 65000,
      category: 'Laptops',
      image: '/assets/images/laptops.jpg'
    },
    {
      id: 2,
      name: 'Smartphone Pro',
      price: 35000,
      category: 'Mobiles',
      image: '/assets/images/iphones.jpg'
    },
    {
      id: 3,
      name: 'Wireless Headphones',
      price: 4500,
      category: 'Headphones',
      image: '/assets/images/headphones.jpg'
    },
    {
      id: 4,
      name: 'Smart Watch',
      price: 8000,
      category: 'Accessories',
      image: '/assets/images/watches.jpg'
    }
  ];

}