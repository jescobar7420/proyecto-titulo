import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { CartService } from '../../services/cart.service';
import { CartProduct } from '../../interfaces/cart-product';
import { ProductosService } from '../../services/productos.service';
import { Product } from '../../interfaces/producto';
import { ProductSupermarket } from '../../interfaces/product-supermarket';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/comparador/notifications/notification-product/notification.component'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  producto!: Product;
  ListaSupermercadosProducto: ProductSupermarket[] = [];
  precio_producto!: string;
  loadingDetails: boolean = false;
  loadingSuper: boolean = false;

  constructor(private productosService: ProductosService,
    private cartService: CartService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadingDetails = true;
    this.loadingSuper = true;
  
    /* Get product details */
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.productosService.getProductById(id))
      )
      .subscribe(producto => {
        this.producto = producto;
        this.loadingDetails = false;
      },
      error => {
        console.error(error);
        this.loadingDetails = false;
      });

    /* Get list of supermarkets */
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.productosService.getProductAtSupermarket(id))
      )
      .subscribe(productos => {
        this.ListaSupermercadosProducto = productos;
        this.loadingSuper = false;
      },
      error => {
        console.error(error);
        this.loadingSuper = false;
      });
  }

  addToCart(id_producto: number) {
    if (!this.ListaSupermercadosProducto[0].precio_oferta) {
      this.precio_producto = this.ListaSupermercadosProducto[0].precio_normal!;
    } else {
      this.precio_producto = this.ListaSupermercadosProducto[0].precio_oferta;
    }

    const new_product: CartProduct = {
      "id_producto": id_producto,
      "nombre": this.producto.nombre!,
      "marca": this.producto.marca!,
      "imagen": this.producto.imagen!,
      "precio": this.precio_producto,
      "cantidad": 1
    }
    this.cartService.addToCart(new_product);
    this.openSnackBar(id_producto, this.producto.nombre!);
  }
  
  openSnackBar(productId: number, nombreProducto: string) {
    this.snackBar.openFromComponent(NotificationComponent, {
      data: { id: productId,
              nombre: nombreProducto },
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
  
  console(a: any) {
    console.log(a)
  }
}
