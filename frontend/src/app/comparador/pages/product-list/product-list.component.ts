import { Component, OnInit } from '@angular/core';
import { ProductCard } from '../../interfaces/product-card';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  productos: ProductCard[] = [];
  
  limit: number = 30;
  
  constructor( private productService: ProductosService ) {}
  
  ngOnInit(): void {
    this.productService.getAvailableProductCards(this.limit)
      .subscribe( productos => this.productos = productos );
  }

}
