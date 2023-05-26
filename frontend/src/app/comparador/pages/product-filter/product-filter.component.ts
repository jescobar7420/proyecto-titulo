import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { Category } from '../../interfaces/category';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit {

  supermercados = new FormControl();
  supermercadosList: string[] = ['Supermercado1', 'Supermercado2', 'Supermercado3', 'Supermercado4']; 

  precioRange = new FormControl();
  categorias = new FormControl();
  marcas = new FormControl({value: null, disabled: true});
  tipos = new FormControl({value: null, disabled: true});
  orden = new FormControl();
  
  categoriasList: Category[] = [];
  marcasList = [];
  tiposList = [];
  selected = 'option2';
  
  constructor(private productService: ProductosService) {}
  
  ngOnInit(): void {
    this.productService.getCategories()
      .subscribe(categoria => this.categoriasList = categoria);
      
      this.categorias.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(categoriasSeleccionadas => {
        if (categoriasSeleccionadas.length > 0) {
          console.log(categoriasSeleccionadas.join(', '));
          // Más código aquí...
        }
      });
  }

}
