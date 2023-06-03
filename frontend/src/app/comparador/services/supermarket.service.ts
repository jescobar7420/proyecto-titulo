import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

import { SupermarketComparisonCard } from '../interfaces/supermarket-comparison-card';

@Injectable({
  providedIn: 'root'
})
export class SupermarketService {

  private baseUrl: string = environment.baseUrl;

  constructor( private http: HttpClient ) { }
  
  getSupermarketComparisonCards(ids_products: string):Observable<SupermarketComparisonCard[]> {
    return this.http.get<SupermarketComparisonCard[]>(`${this.baseUrl}/api/supermarket-comparison?ids_products=${ids_products}`);
  }
}
