import { Component, Input, OnInit } from '@angular/core';
import { ProductCard } from '../../interfaces/product-card';
import { CartService } from '../../services/cart.service';
import { CartProduct } from '../../interfaces/cart-product';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/comparador/notification/notification.component'; // Aseg

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  
  @Input() producto!: ProductCard;
  isHovered = false;
   
  constructor(private cartService: CartService,
              private snackBar: MatSnackBar) {}
 
  addToCart(id_producto: number) {
    const new_product: CartProduct = {
      "id_producto": id_producto,
      "nombre": this.producto.nombre,
      "marca": this.producto.marca,
      "imagen": this.producto.imagen,
      "precio": this.producto.precio,
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
      verticalPosition: 'bottom'
    });
  }
}

  
  


