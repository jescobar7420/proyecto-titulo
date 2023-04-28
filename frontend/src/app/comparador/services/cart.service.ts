import { Injectable } from '@angular/core';
import { CartProduct } from '../interfaces/cart-product';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart: CartProduct[];
  public cartUpdated = new Subject<void>();

  constructor() { 
    const storedCart = localStorage.getItem('cart');
    this.cart = storedCart ? JSON.parse(storedCart) : [];
  }
  
  addToCart(product: CartProduct) { 
    const existingProductIndex = this.cart.findIndex(item => item.id_producto === product.id_producto);
    
    if (existingProductIndex > -1) {
      this.cart[existingProductIndex].cantidad += 1;
    } else {
      product.cantidad = 1;
      this.cart.push(product);
    }
    
    this.cart.forEach((cartProduct: CartProduct) => {
      cartProduct.precio_total = parseFloat(cartProduct.precio) * cartProduct.cantidad;
    });

    
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.cartUpdated.next();
  }
  
  removeFromCart(id: number) {
    const index = this.cart.findIndex((product) => product.id_producto === id);
    if (index !== -1) {
      this.cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(this.cart));
      this.cartUpdated.next();
    }
  }

  getCart(): CartProduct[] {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      return JSON.parse(storedCart);
    }
    return [];
  }
  
  clearCart() {
    this.cart = [];
    localStorage.removeItem('cart');
    this.cartUpdated.next();
  }
  
  getTotalQuantity(): number {
    let totalQuantity = 0;
    this.cart.forEach((product: CartProduct) => {
      totalQuantity += product.cantidad;
    });
    return totalQuantity;
  }

  getCartUpdatedListener() {
    return this.cartUpdated.asObservable();
  }

  increaseProductQuantity(id: number) {
    const index = this.cart.findIndex((product) => product.id_producto === id);
    if (index !== -1) {
      this.cart[index].cantidad += 1;
      this.cart[index].precio_total = parseFloat(this.cart[index].precio) * this.cart[index].cantidad;
      localStorage.setItem('cart', JSON.stringify(this.cart));
      this.cartUpdated.next();
    }
  }
  
  decreaseProductQuantity(id: number) {
    const index = this.cart.findIndex((product) => product.id_producto === id);
    if (index !== -1) {
      if (this.cart[index].cantidad === 1) {
        this.removeFromCart(id);
      } else {
        this.cart[index].cantidad -= 1;
        this.cart[index].precio_total = parseFloat(this.cart[index].precio) * this.cart[index].cantidad;
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.cartUpdated.next();
      }
    }
  }
  
  
}
