import { Component, Inject, OnInit } from '@angular/core';
import { SupermarketService } from '../../services/supermarket.service';
import { SupermarketProductCard } from '../../interfaces/supermarket-product-card';
import { CartService } from '../../services/cart.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-products-supermarket',
  templateUrl: './dialog-products-supermarket.component.html',
  styleUrls: ['./dialog-products-supermarket.component.scss']
})
export class DialogProductsSupermarketComponent implements OnInit {

  listAvailableProducts: SupermarketProductCard[] = [];
  listNoStockProducts: SupermarketProductCard[] = [];
  listNoDistributeProducts: SupermarketProductCard[] = [];
  listSaleProducts: SupermarketProductCard[] = [];

  loading: boolean = false;
  id_supermercado: string;

  constructor(private supermarketService: SupermarketService,
              private cartService: CartService,
              @Inject(MAT_DIALOG_DATA) data: any) {

    this.id_supermercado = data.id_supermercado;
  }

  ngOnInit(): void {
    this.loading = false;
    let ids_products: string = this.cartService.getProductIds();
    let arr = ids_products.split(",").map(Number);

    this.supermarketService.getAvailableProductsSupermarket(this.id_supermercado, ids_products)
      .subscribe(producto => {
        this.listAvailableProducts = this.updateProductAttributes(producto, arr);
      });

    this.supermarketService.getNoStockProductsSupermarket(this.id_supermercado, ids_products)
      .subscribe(producto => {
        this.listNoStockProducts = this.updateProductAttributes(producto, arr);
      });

    this.supermarketService.geNoDistributeProductsSupermarket(this.id_supermercado, ids_products)
      .subscribe(producto => {
        this.listNoDistributeProducts = this.updateProductAttributes(producto, arr);
      });

    this.supermarketService.getSaleProductsSupermarket(this.id_supermercado, ids_products)
      .subscribe(producto => {
        this.listSaleProducts = this.updateProductAttributes(producto, arr);
      });

    this.loading = true;
  }

  updateProductAttributes(productList:SupermarketProductCard[], arr:number[]) {
    return productList.map(product => {
      if (arr.includes(product.id_producto)) {
        product.cantidad = this.cartService.getQuantity(product.id_producto);
        product.precio_total = product.precio_unitario * product.cantidad;
      }
      return product;
    });
  }
}
