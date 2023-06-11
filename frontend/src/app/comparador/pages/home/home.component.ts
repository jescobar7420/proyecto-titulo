import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Observable, Subscription, of } from 'rxjs';
import { CartProduct } from '../../interfaces/cart-product';
import { ProductosService } from '../../services/productos.service';
import { ProductCard } from '../../interfaces/product-card';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { ProductSearch } from '../../interfaces/product-search';
import { map, switchMap } from 'rxjs/operators'; // Recuerda importar los operadores aquí
import { Router } from '@angular/router';

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

  filteredOptions: Observable<ProductSearch[]>;
  searchForm: FormGroup; 

  private cartUpdatedSubscription: Subscription;

  constructor(private cartService: CartService,
              private productService: ProductosService,
              public authService: AuthService,
              private fb: FormBuilder,
              private router: Router) {
    this.totalProducts = cartService.getTotalQuantity();
    this.cartUpdatedSubscription = this.cartService.cartUpdated.subscribe(() => {
      this.totalProducts = this.cartService.getTotalQuantity();
    });

    this.searchForm = this.fb.group({
      search: new FormControl(''),
    });

    this.filteredOptions = this.searchForm.get('search')!.valueChanges
    .pipe(
      switchMap((value: string) => {
        if (value) {
          const formattedValue = value.toUpperCase().replace(/\s/g, '%');
          return this.productService.getSearchProductByName(formattedValue);
        } else {
          return of([]);
        }
      }),
      map((products: any[]) => {
        if (products.length === 0) {
          return [{nombre: `No se encontró nada con el término ${this.searchForm.get('search')!.value}`, id_producto: ''}];
        } else {
          return products;
        }
      })
    );
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

  onOptionSelected() {
    this.searchForm.get('search')!.reset();
  }
  
  getTotalProductsCart():number {
    return this.cartService.getTotalQuantity();
  }
  
  logOut() {
    this.cartService.clearCart();
    this.authService.logout();
    this.router.navigate(['/comparador/login']);
  }
}