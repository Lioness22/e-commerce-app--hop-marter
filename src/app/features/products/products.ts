
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { CartService } from '../../core/services/cart';
import { PRODUCTS } from '../../core/data/products';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule,RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css'
})

export class Products {
private cartService = inject(CartService);
  searchText = '';
  selectedCategory = 'All';
  products = PRODUCTS;
  categories = [
    'All',
    'Laptops',
    'Mobiles',
    'Headphones',
    'Accessories'
  ];

  // products = [
  //   {
  //     id: 1,
  //     name: 'Premium Laptop',
  //     price: 65000,
  //     category: 'Laptops',
  //     image: 'https://placehold.co/400x300?text=Laptop'
  //   },
  //   {
  //     id: 2,
  //     name: 'Smartphone Pro',
  //     price: 35000,
  //     category: 'Mobiles',
  //     image: 'https://placehold.co/400x300?text=Mobile'
  //   },
  //   {
  //     id: 3,
  //     name: 'Wireless Headphones',
  //     price: 4500,
  //     category: 'Headphones',
  //     image: 'https://placehold.co/400x300?text=Headphones'
  //   },
  //   {
  //     id: 4,
  //     name: 'Smart Watch',
  //     price: 8000,
  //     category: 'Accessories',
  //     image: 'https://placehold.co/400x300?text=Watch'
  //   },
  //   {
  //     id: 5,
  //     name: 'Gaming Laptop',
  //     price: 85000,
  //     category: 'Laptops',
  //     image: 'https://placehold.co/400x300?text=Gaming+Laptop'
  //   },
  //   {
  //     id: 6,
  //     name: 'Android Phone',
  //     price: 22000,
  //     category: 'Mobiles',
  //     image: 'https://placehold.co/400x300?text=Android'
  //   }
  // ];

  get filteredProducts() {
    return this.products.filter(product => {
      const matchesCategory =
        this.selectedCategory === 'All' ||
        product.category === this.selectedCategory;

      const matchesSearch =
        product.name.toLowerCase().includes(
          this.searchText.toLowerCase()
        );

      return matchesCategory && matchesSearch;
    });
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

 addToCart(product: any): void {
  this.cartService.addToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    category: product.category,
    image: product.image
  });

  alert(product.name + ' added to cart!');
}
}
