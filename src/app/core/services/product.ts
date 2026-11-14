
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
}

interface ProductApiResponse {
  success: boolean;
  count: number;
  data: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5000/api/products';

  getProducts(): Observable<ProductApiResponse> {
    return this.http.get<ProductApiResponse>(this.apiUrl);
  }
}
