import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';
import { CartProduct } from '../../interfaces/cart-product';
import { ProductosService } from '../../services/productos.service';
import { ProductCard } from '../../interfaces/product-card';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  productosDestacados: ProductCard[] = [];
  totalProducts: number = 0;
  limit: number = 30;
  cart: CartProduct[] = [];
  
  private cartUpdatedSubscription: Subscription;
  

  constructor(private cartService: CartService, private productService: ProductosService) {
    this.totalProducts = cartService.getTotalQuantity();
    this.cartUpdatedSubscription = this.cartService.cartUpdated.subscribe(() => {
      this.totalProducts = this.cartService.getTotalQuantity();
    });
  }

  ngOnInit() {
    this.totalProducts = this.cartService.getTotalQuantity();
    this.cartUpdatedSubscription = this.cartService.getCartUpdatedListener().subscribe(() => {
      this.totalProducts = this.cartService.getTotalQuantity();
    });
    
    this.productService.getAvailableProductCards(this.limit)
      .subscribe(producto => this.productosDestacados = producto);
  }

  ngOnDestroy() {
    this.cartUpdatedSubscription.unsubscribe();
  }
  
  getCartProducts() {
    this.cart = this.cartService.getCart();
  }
  
  decreaseProductQuantity(productId: number) {
    this.cartService.decreaseProductQuantity(productId);
    this.getCartProducts();
  }
  
  increaseProductQuantity(productId: number) {
    this.cartService.increaseProductQuantity(productId);
    this.getCartProducts();
  }
  
  removeProductFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
    this.getCartProducts();
  }
}