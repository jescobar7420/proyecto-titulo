import { Component, Input } from '@angular/core';
import { SupermarketProductCard } from '../../interfaces/supermarket-product-card';
import { CartService } from '../../services/cart.service';
import { CartProduct } from '../../interfaces/cart-product';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from '../../notifications/notification-product/notification.component';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-product-supermarket-card',
  templateUrl: './product-supermarket-card.component.html',
  styleUrls: ['./product-supermarket-card.component.scss']
})
export class ProductSupermarketCardComponent {

  @Input() producto!: SupermarketProductCard;
  @Input() flag_quotation: boolean = false;

  constructor(private cartService: CartService,
              private snackBar: MatSnackBar,
              private productosService: ProductosService) {}
  
  addToCart(id_producto: number) {
    this.productosService.getProductCartById(id_producto)
      .subscribe(new_product => {
        this.cartService.addToCart(new_product);
        this.openSnackBar(id_producto, this.producto.nombre!);
      });
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
