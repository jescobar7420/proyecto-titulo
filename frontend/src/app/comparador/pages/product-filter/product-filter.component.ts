import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { Subscription, of } from 'rxjs';
import { ViewportScroller } from '@angular/common';

import { Category } from '../../interfaces/category';
import { ProductosService } from '../../services/productos.service';
import { Marca } from '../../interfaces/marca';
import { TipoProducto } from '../../interfaces/tipo-producto';
import { Supermercado } from '../../interfaces/supermercado';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ProductCard } from '../../interfaces/product-card';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit {

  minPrice: number = 0;
  maxPrice: number = 300000;
  rangeMin = this.minPrice;
  rangeMax = this.maxPrice;
    
  flag_filter: boolean = false;
  flag_loading: boolean = false;
  
  total_results: number = 0;
  offset: number = 0;
  
  supermercados = new FormControl<string[]>([]);
  precioRange = new FormControl();
  categorias = new FormControl();
  marcas = new FormControl();
  tipos = new FormControl();
  orden = new FormControl();

  categoriasList: Category[] = [];
  marcasList: Marca[] = [];
  tiposList: TipoProducto[] = [];
  supermercadosList: Supermercado[] = [];
  productosFilters: ProductCard[] = [];
  
  private categoriasSubscription?: Subscription;
  private supermercadosSubscription?: Subscription;
  
  filterData = {
    supermercados: this.supermercados.value && this.supermercados.value.length > 0 ? this.supermercados.value.join(', ') : null,
    precioMin: this.rangeMin ? this.rangeMin.toString() : this.minPrice,
    precioMax: this.rangeMax ? this.rangeMax.toString() : this.maxPrice,
    categorias: this.categorias.value && this.categorias.value.length > 0 ? this.categorias.value.join(', ') : null,
    tipos: this.tipos.value && this.tipos.value.length > 0 ? this.tipos.value.join(', ') : null,
    marcas: this.marcas.value && this.marcas.value.length > 0 ? this.marcas.value.join(', ') : null,
    order: this.orden.value ? this.orden.value : null,
    offset: this.offset
  }

  constructor(private productService: ProductosService, 
              private viewportScroller: ViewportScroller) { }

  ngOnInit(): void {
    this.tipos.disable();
    this.marcas.disable();
  
    this.categoriasSubscription = this.productService.getAllCategories()
      .subscribe(categoria => this.categoriasList = categoria);
    
    this.supermercadosSubscription = this.productService.getAllSupermarkets()
      .subscribe(supermercado => this.supermercadosList = supermercado);
  
    this.categorias.valueChanges
      .pipe(
        debounceTime(500),
        switchMap(ids_categories => {
          if (ids_categories && ids_categories.length) {
            this.tipos.reset();
            this.marcas.reset();
            this.tipos.enable();
            return this.productService.getTypesByCategoryBrand(ids_categories);
          } else {
            this.tipos.disable();
            return of([]);
          }
        }),
        tap(types => this.tiposList = types)
      )
      .subscribe();
  
    this.tipos.valueChanges
      .pipe(
        debounceTime(500),
        switchMap(ids_types => {
          if (ids_types && ids_types.length) {
            this.marcas.enable();
            return this.productService.getBrandsByTypes(ids_types);
          } else {
            this.marcas.disable();
            return of([]);
          }
        }),
        tap(brands => this.marcasList = brands)
      )
      .subscribe();
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
  }
  
  onFilterClick(): void {
    this.flag_loading = true;
    this.productosFilters = [];
    
    this.filterData = {
      supermercados: this.supermercados.value && this.supermercados.value.length > 0 ? this.supermercados.value.join(', ') : null,
      precioMin: this.rangeMin ? this.rangeMin.toString() : this.minPrice,
      precioMax: this.rangeMax ? this.rangeMax.toString() : this.maxPrice,
      categorias: this.categorias.value && this.categorias.value.length > 0 ? this.categorias.value.join(', ') : null,
      tipos: this.tipos.value && this.tipos.value.length > 0 ? this.tipos.value.join(', ') : null,
      marcas: this.marcas.value && this.marcas.value.length > 0 ? this.marcas.value.join(', ') : null,
      order: this.orden.value ? this.orden.value : null,
      offset: this.offset
    }
    
    if (!this.flag_filter) {
      this.flag_filter = true;
    }
    
    this.productService.getTotalResultFilter(this.filterData).subscribe(result => {this.total_results = (Number(result[0].count))});
    this.productService.getFilteredProducts(this.filterData).subscribe(producto => {this.productosFilters = producto});
    
    this.flag_loading = false;
  }
  
  onSupermercadoChange(event: MatCheckboxChange, id_supermercado: string) {
    if (event.checked) {
      (this.supermercados.value as string[]).push(id_supermercado);
    } else {
      const index = (this.supermercados.value as string[]).indexOf(id_supermercado);
      if (index > -1) {
        (this.supermercados.value as string[]).splice(index, 1);
      }
    }
    this.supermercados.setValue(this.supermercados.value, { emitEvent: false });
  }
  
  clearFields(): void {
    this.productosFilters = [];
    this.flag_filter = false;
    this.categorias.reset();
    this.tipos.reset();
    this.marcas.reset();
    this.rangeMax = this.maxPrice;
    this.rangeMin = this.minPrice;
    this.orden.reset();
    this.supermercados.setValue([]);
  }
   
  ngOnDestroy(): void {
    this.categoriasSubscription?.unsubscribe();
    this.supermercadosSubscription?.unsubscribe();
  }
  
  nextPage() {
    this.offset += 20;
    this.onFilterClick();
  }
  
  previousPage() {
    this.offset -= 20;
    if (this.offset < 0) {
      this.offset = 0;
    }
    this.onFilterClick();
  }
  
  scrollToTop() {
    this.viewportScroller.scrollToPosition([0, 0]);
  }
}