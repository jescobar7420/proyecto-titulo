import { Component, Input } from '@angular/core';
import { SupermarketProductCard } from '../../interfaces/supermarket-product-card';

@Component({
  selector: 'app-list-products-quotation',
  templateUrl: './list-products-quotation.component.html',
  styleUrls: ['./list-products-quotation.component.scss']
})
export class ListProductsQuotationComponent {
  @Input() listProducts!: SupermarketProductCard[];

}
