import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

import { SupermarketComparisonCard } from '../interfaces/supermarket-comparison-card';
import { SupermarketProductCard } from '../interfaces/supermarket-product-card';

@Injectable({
  providedIn: 'root'
})
export class SupermarketService {

  private baseUrl: string = environment.baseUrl;

  constructor( private http: HttpClient ) { }
  
  getSupermarketComparisonCards(ids_products: string):Observable<SupermarketComparisonCard[]> {
    return this.http.get<SupermarketComparisonCard[]>(`${this.baseUrl}/api/supermarket-comparison?ids_products=${ids_products}`);
  }
  
  getSaleProductsSupermarket(id_supermercado: string, ids_products: string):Observable<SupermarketProductCard[]> {
    return this.http.get<SupermarketProductCard[]>(`${this.baseUrl}/api/supermarket-sale?id_supermarket=${id_supermercado}&ids_products=${ids_products}`);
  }
  
  geNoDistributeProductsSupermarket(id_supermercado: string, ids_products: string):Observable<SupermarketProductCard[]> {
    return this.http.get<SupermarketProductCard[]>(`${this.baseUrl}/api/supermarket-no-distribute?id_supermarket=${id_supermercado}&ids_products=${ids_products}`);
  }
  
  getNoStockProductsSupermarket(id_supermercado: string, ids_products: string):Observable<SupermarketProductCard[]> {
    return this.http.get<SupermarketProductCard[]>(`${this.baseUrl}/api/supermarket-no-stock?id_supermarket=${id_supermercado}&ids_products=${ids_products}`);
  }
  
  getAvailableProductsSupermarket(id_supermercado: string, ids_products: string):Observable<SupermarketProductCard[]> {
    return this.http.get<SupermarketProductCard[]>(`${this.baseUrl}/api/supermarket-available?id_supermarket=${id_supermercado}&ids_products=${ids_products}`);
  }
  
  getProductsPricesAvailablesSupermarket(id_supermercado: string, ids_products: string):Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/supermarket-products-prices?id_supermarket=${id_supermercado}&ids_products=${ids_products}`);
  }
}
