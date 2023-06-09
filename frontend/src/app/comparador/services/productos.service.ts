import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod'; 

import { ProductCard } from '../interfaces/product-card';
import { Product } from '../interfaces/producto';
import { ProductSupermarket } from '../interfaces/product-supermarket';
import { Category } from '../interfaces/category';
import { Marca } from '../interfaces/marca';
import { TipoProducto } from '../interfaces/tipo-producto';
import { CategoriaMarcaTipo } from '../interfaces/categoria-marca-tipo';
import { Supermercado } from '../interfaces/supermercado';
import { CartProduct } from '../interfaces/cart-product';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private baseUrl: string = environment.baseUrl  + '/api/';

  constructor( private http: HttpClient ) { }
  
  getProductCardById(id: number):Observable<ProductCard> {
    return this.http.get<ProductCard>(`${this.baseUrl}product-card/${id}`);
  }
  
  getAvailableProductCards(limit?: number):Observable<ProductCard[]> {
    if (limit) {
      return this.http.get<ProductCard[]>(`${this.baseUrl}available-products?limit=${limit}`);
    }
    return this.http.get<ProductCard[]>(`${this.baseUrl}available-products`);
  }
  
  getProductById(id: number):Observable<Product> {
    return this.http.get(`${this.baseUrl}productos/${id}`);
  }
  
  getProductAtSupermarket(id_product: number):Observable<ProductSupermarket[]> {
    return this.http.get<ProductSupermarket[]>(`${this.baseUrl}supermercados-productos/${id_product}`);
  }
  
  getAllCategories(limit?: number):Observable<Category[]> {
    if (limit) {
      return this.http.get<Category[]>(`${this.baseUrl}categorias?limit=${limit}`);
    }
    return this.http.get<Category[]>(`${this.baseUrl}categorias`);
  }
  
  getAllBrands(limit?: number):Observable<Marca[]> {
    if (limit) {
      return this.http.get<Marca[]>(`${this.baseUrl}marcas?limit=${limit}`);
    }
    return this.http.get<Marca[]>(`${this.baseUrl}marcas`);
  }
  
  getAllTypes(limit?: number):Observable<TipoProducto[]> {
    if (limit) {
      return this.http.get<TipoProducto[]>(`${this.baseUrl}tipos?limit=${limit}`);
    }
    return this.http.get<TipoProducto[]>(`${this.baseUrl}tipos`);
  }
  
  getCategoriesBrandsTypes():Observable<CategoriaMarcaTipo[]> {
    return this.http.get<CategoriaMarcaTipo[]>(`${this.baseUrl}categorias-marcas-tipos`);
  }
  
  getBrandsByCategoryType(ids_categories: string, ids_types?: string): Observable<Marca[]> {
    if (ids_types) {
      return this.http.get<Marca[]>(`${this.baseUrl}filter-brand?categories=${ids_categories}&types=${ids_types}`);
    }
    return this.http.get<Marca[]>(`${this.baseUrl}filter-brand?categories=${ids_categories}`);
  }
  
  getTypesByCategoryBrand(ids_categories: string, ids_brands?: string): Observable<TipoProducto[]> {
    if (ids_brands) {
      return this.http.get<TipoProducto[]>(`${this.baseUrl}filter-types?categories=${ids_categories}&brands=${ids_brands}`);
    }
    return this.http.get<TipoProducto[]>(`${this.baseUrl}filter-types?categories=${ids_categories}`);
  }
  
  getBrandsByTypes(ids_types: string): Observable<Marca[]> {
    return this.http.get<Marca[]>(`${this.baseUrl}filter-brands-types?types=${ids_types}`);
  }
  
  getTypesByBrands(ids_brands: string): Observable<TipoProducto[]> {
    return this.http.get<TipoProducto[]>(`${this.baseUrl}filter-types-brands?brands=${ids_brands}`);
  }
  
  getAllSupermarkets():Observable<Supermercado[]> {
    return this.http.get<Supermercado[]>(`${this.baseUrl}supermercados`);
  }
  
  getFilteredProducts(filterData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}products-filter`, filterData);
  }
  
  getTotalResultFilter(filterData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}products-filter-result`, filterData);
  }
  
  getSearchProductByName(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}search-product?name=${name}`);
  }
  
  getProductCartById(id_producto: number): Observable<CartProduct> {
    return this.http.get<CartProduct>(`${this.baseUrl}product-cart?id_producto=${id_producto}`);
  }
  
  getProductCartByListId(ids_producto: string): Observable<CartProduct[]> {
    return this.http.get<CartProduct[]>(`${this.baseUrl}list-product-cart?ids_products=${ids_producto}`);
  }
  
  getMostSoughtProducts():Observable<ProductCard[]> {
    return this.http.get<ProductCard[]>(`${this.baseUrl}most-sought-products`);
  }
}
