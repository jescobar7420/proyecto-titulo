import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment.prod'; 

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private baseUrl: string = environment.baseUrl;

  constructor( private http: HttpClient ) { }
  
  getProductos() {
    return this.http.get(`${this.baseUrl}/ListProductos`);
  }
}
