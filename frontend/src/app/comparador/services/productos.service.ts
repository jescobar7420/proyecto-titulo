import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment.prod'; 
import { ProductCard } from '../interfaces/product-card';

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
}
