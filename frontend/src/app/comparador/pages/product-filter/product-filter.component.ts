import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { Subscription, forkJoin, of } from 'rxjs';

import { Category } from '../../interfaces/category';
import { ProductosService } from '../../services/productos.service';
import { Marca } from '../../interfaces/marca';
import { TipoProducto } from '../../interfaces/tipo-producto';
import { Supermercado } from '../../interfaces/supermercado';
import { MatCheckboxChange } from '@angular/material/checkbox';

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
  firstFilter: boolean = false;
  
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
  
  private categoriasSubscription?: Subscription;
  private supermercadosSubscription?: Subscription;

  constructor(private productService: ProductosService) { }

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
            this.marcas.enable();
            this.tipos.enable();
            return forkJoin({
              brands: this.productService.getBrandsByCategoryType(ids_categories),
              types: this.productService.getTypesByCategoryBrand(ids_categories),
            });
          } else {
            this.marcas.disable();
            this.tipos.disable();
            return of({ brands: [], types: [] });
          }
        }),
        tap(({ brands, types }) => {
          this.marcasList = brands;
          this.tiposList = types;
        })
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
    const filterData = {
      supermercados: this.supermercados.value && this.supermercados.value.length > 0 ? this.supermercados.value.join(', ') : null,
      precioMin: this.rangeMin ? this.rangeMin.toString() : this.minPrice,
      precioMax: this.rangeMax ? this.rangeMax.toString() : this.maxPrice,
      categorias: this.categorias.value && this.categorias.value.length > 0 ? this.categorias.value.join(', ') : null,
      tipos: this.tipos.value && this.tipos.value.length > 0 ? this.tipos.value.join(', ') : null,
      marcas: this.marcas.value && this.marcas.value.length > 0 ? this.marcas.value.join(', ') : null,
      order: this.orden.value ? this.orden.value : null
    }
 
    this.productService.getFilteredProducts(filterData).subscribe(result => {
      console.log(result);
    });
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
  
}