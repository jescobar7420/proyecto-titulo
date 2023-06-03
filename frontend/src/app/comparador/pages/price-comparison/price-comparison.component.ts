import { Component, OnInit } from '@angular/core';
import { SupermarketComparisonCard } from '../../interfaces/supermarket-comparison-card';
import { SupermarketService } from '../../services/supermarket.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-price-comparison',
  templateUrl: './price-comparison.component.html',
  styleUrls: ['./price-comparison.component.scss']
})
export class PriceComparisonComponent implements OnInit {

  supermarketComparisonCards: SupermarketComparisonCard[] = [];
  
  constructor(private supermarketService: SupermarketService,
              private cartService: CartService) {}

  ngOnInit(): void {
    let ids_products: string = this.cartService.getProductIds();
    this.supermarketService.getSupermarketComparisonCards(ids_products)
      .subscribe(supermarkets => {
        this.supermarketComparisonCards = supermarkets
      });
  }
}
