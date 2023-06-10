import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod'; 

@Injectable({
  providedIn: 'root'
})
export class QuotationService {

  private baseUrl: string = environment.baseUrl;

  constructor( private http: HttpClient ) { }
  
  postInsertQuotation(id_usuario: number, id_supermercado: number, nombre: string, monto_total: number, fecha: string, ids_products: number[], quantities: number[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/insert-quotation`, {id_usuario, id_supermercado, nombre, monto_total, fecha, ids_products, quantities});
  }
}
