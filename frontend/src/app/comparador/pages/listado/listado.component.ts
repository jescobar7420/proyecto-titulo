import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss']
})
export class ListadoComponent implements OnInit {

  prueba: string = '';

  constructor( private productosService: ProductosService ) {}

  ngOnInit(): void {
      this.productosService.getProductos()
        .subscribe(resp => console.log(resp));
  }
}
