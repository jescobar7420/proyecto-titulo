import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { ProductCard } from '../../interfaces/product-card';

@Component({
  selector: 'app-featured-products',
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.scss']
})
export class FeaturedProductsComponent implements OnInit {

  productos: ProductCard[] = [];
  loading: boolean = false;

  constructor(private productosService: ProductosService) {}
  
  ngOnInit(): void {
    this.loading = true;
    this.productosService.getMostSoughtProducts()
      .subscribe(producto => {
        this.productos = producto;
        this.loading = false;
      });
  }
}
