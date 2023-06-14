import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod'; 
import { QuotationDetail } from '../interfaces/quotation-detail';
import { SupermarketProductCard } from '../interfaces/supermarket-product-card';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {

  private baseUrl: string = environment.baseUrl;

  constructor( private http: HttpClient ) { }
  
  postInsertQuotation(id_usuario: number, id_supermercado: number, nombre: string, monto_total: number, fecha: string, ids_products: number[], quantities: number[], prices: number[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/insert-quotation`, {id_usuario, id_supermercado, nombre, monto_total, fecha, ids_products, quantities, prices});
  }
  
  getQuotationUser(id_usuario: number, order_quotation?: string): Observable<QuotationDetail[]> {
    if (order_quotation) {
      return this.http.get<QuotationDetail[]>(`${this.baseUrl}/api/quotation-filter?id_usuario=${id_usuario}&order_quotation=${order_quotation}`);
    }
    return this.http.get<QuotationDetail[]>(`${this.baseUrl}/api/quotation-filter?id_usuario=${id_usuario}`);
  }
  
  getProductsQuotation(id_cotizacion: number): Observable<SupermarketProductCard[]> {
    return this.http.get<SupermarketProductCard[]>(`${this.baseUrl}/api/quotation-products?id_cotizacion=${id_cotizacion}`);
  }
  
  getSaleProductsSupermarketQuotation(id_cotizacion: string, ids_products: string):Observable<SupermarketProductCard[]> {
    return this.http.get<SupermarketProductCard[]>(`${this.baseUrl}/api/quotation-supermarket-sale?id_cotizacion=${id_cotizacion}&ids_products=${ids_products}`);
  }
  
  geNoDistributeProductsSupermarketQuotation(id_cotizacion: string, ids_products: string):Observable<SupermarketProductCard[]> {
    return this.http.get<SupermarketProductCard[]>(`${this.baseUrl}/api/quotation-supermarket-no-distribute?id_cotizacion=${id_cotizacion}&ids_products=${ids_products}`);
  }
  
  getNoStockProductsSupermarketQuotation(id_cotizacion: string, ids_products: string):Observable<SupermarketProductCard[]> {
    return this.http.get<SupermarketProductCard[]>(`${this.baseUrl}/api/quotation-supermarket-no-stock?id_cotizacion=${id_cotizacion}&ids_products=${ids_products}`);
  }
  
  getAvailableProductsSupermarketQuotation(id_cotizacion: string, ids_products: string):Observable<SupermarketProductCard[]> {
    return this.http.get<SupermarketProductCard[]>(`${this.baseUrl}/api/quotation-supermarket-available?id_cotizacion=${id_cotizacion}&ids_products=${ids_products}`);
  }
  
  getListProductsQuotation(id_cotizacion: number):Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/api/quotation-list-products?id_cotizacion=${id_cotizacion}`);
  }
  
  deleteQuotation(id_cotizacion: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/delete-quotation?id_cotizacion=${id_cotizacion}`);
  }
}
