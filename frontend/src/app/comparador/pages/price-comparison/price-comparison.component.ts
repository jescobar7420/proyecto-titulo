import { Component, OnInit } from '@angular/core';
import { SupermarketComparisonCard } from '../../interfaces/supermarket-comparison-card';
import { SupermarketService } from '../../services/supermarket.service';
import { CartService } from '../../services/cart.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-price-comparison',
  templateUrl: './price-comparison.component.html',
  styleUrls: ['./price-comparison.component.scss']
})
export class PriceComparisonComponent implements OnInit {

  supermarketComparisonCards: SupermarketComparisonCard[] = [];
  listProducts: any[] = [];

  constructor(private supermarketService: SupermarketService,
    private cartService: CartService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    let ids_products: string = this.cartService.getProductIds();
    
    this.supermarketService.getSupermarketComparisonCards(ids_products)
      .subscribe(supermarkets => {
        this.supermarketComparisonCards = supermarkets;

        let promises = this.supermarketComparisonCards.map((supermarketCard, i) => {
          return new Promise<void>((resolve) => {
            this.supermarketService.getProductsPricesAvailablesSupermarket(supermarketCard.id_supermercado.toString(), ids_products)
              .subscribe(products => {
                let total_price = 0;
                for (let product of products) {
                  let quantity = this.cartService.getQuantity(product.id_producto);
                  total_price += product.precio * quantity;
                }

                this.supermarketComparisonCards[i].total_value = total_price;
                resolve();
              });
          });
        });

        Promise.all(promises).then(() => {
          this.supermarketComparisonCards.sort((a, b) => a.total_value - b.total_value);
        });

      });
  }

}
