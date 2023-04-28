import { Component, Input, OnInit } from '@angular/core';
import { ProductCard } from '../../interfaces/product-card';
import { CartService } from '../../services/cart.service';
import { CartProduct } from '../../interfaces/cart-product';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  
  @Input() producto!: ProductCard;
   
  constructor(private cartService: CartService) {}
 
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
  }
}

  
  


