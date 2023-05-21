import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment.prod'; 
import { ProductCard } from '../interfaces/product-card';
import { Product } from '../interfaces/producto';
import { ProductSupermarket } from '../interfaces/product-supermarket';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private baseUrl: string = environment.baseUrl;

  constructor( private http: HttpClient ) { }
  
  getProductCardById(id: number):Observable<ProductCard> {
    return this.http.get<ProductCard>(`${this.baseUrl}/api/product-card/${id}`);
  }
  
  getAvailableProductCards(limit: number):Observable<ProductCard[]> {
    return this.http.get<ProductCard[]>(`${this.baseUrl}/api/available-products`);
  }
  
  getProductById(id: number):Observable<Product> {
    return this.http.get(`${this.baseUrl}/api/productos/${id}`);
  }
  
  getProductAtSupermarket(id_product: number):Observable<ProductSupermarket[]> {
    return this.http.get<ProductSupermarket[]>(`${this.baseUrl}/api/supermercados-productos/${id_product}`);
  }
}
