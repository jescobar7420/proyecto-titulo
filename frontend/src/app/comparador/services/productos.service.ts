import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor( private http: HttpClient ) { }
  
  getProductos() {
    return this.http.get('');
  }
}
