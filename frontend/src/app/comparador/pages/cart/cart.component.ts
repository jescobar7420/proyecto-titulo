import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';
import { CartProduct } from '../../interfaces/cart-product';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {

  total_products: number = 0;
  cart: CartProduct[] = [];
  
  private cartUpdatedSubscription: Subscription;
  

  constructor(private cartService: CartService) {
    this.total_products = cartService.getTotalQuantity();
    this.cartUpdatedSubscription = this.cartService.cartUpdated.subscribe(() => {
      this.total_products = this.cartService.getTotalQuantity();
    });
  }
  

  ngOnInit() {
    this.total_products = this.cartService.getTotalQuantity();
    this.cartUpdatedSubscription = this.cartService.getCartUpdatedListener().subscribe(() => {
      this.total_products = this.cartService.getTotalQuantity();
    });
  }

  ngOnDestroy() {
    this.cartUpdatedSubscription.unsubscribe();
  }
  
  getCartProducts() {
    this.cart = this.cartService.getCart();
  }
  
  lessQuantityProduct(id_producto: number) {
    this.cartService.decreaseProductQuantity(id_producto);
    this.getCartProducts();
  }
  
  addQuantityProduct(id_producto: number) {
    this.cartService.increaseProductQuantity(id_producto);
    this.getCartProducts();
  }
  
  removeProductCart(id_producto: number) {
    this.cartService.removeFromCart(id_producto);
    this.getCartProducts();
  }
}
