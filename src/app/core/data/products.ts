export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Premium Laptop',
    price: 65000,
    category: 'Laptops',
    image: 'https://placehold.co/400x300?text=Laptop',
    description: 'A premium laptop designed for productivity, everyday work and entertainment.'
  },
  {
    id: 2,
    name: 'Smartphone Pro',
    price: 35000,
    category: 'Mobiles',
    image: 'https://placehold.co/400x300?text=Mobile',
    description: 'A powerful smartphone with modern features for everyday use.'
  },
  {
    id: 3,
    name: 'Wireless Headphones',
    price: 4500,
    category: 'Headphones',
    image: 'https://placehold.co/400x300?text=Headphones',
    description: 'Enjoy your music with convenient wireless listening.'
  },
  {
    id: 4,
    name: 'Smart Watch',
    price: 8000,
    category: 'Accessories',
    image: 'https://placehold.co/400x300?text=Watch',
    description: 'A smart watch for notifications, everyday convenience and activity tracking.'
  },
  {
    id: 5,
    name: 'Gaming Laptop',
    price: 85000,
    category: 'Laptops',
    image: 'https://placehold.co/400x300?text=Gaming+Laptop',
    description: 'A gaming laptop designed for immersive gaming and demanding applications.'
  },
  {
    id: 6,
    name: 'Android Phone',
    price: 22000,
    category: 'Mobiles',
    image: 'https://placehold.co/400x300?text=Android',
    description: 'An Android smartphone for communication, apps and entertainment.'
  }
];