import { Component, Input } from '@angular/core';
import { SupermarketProductCard } from '../../interfaces/supermarket-product-card';

@Component({
  selector: 'app-product-supermarket-card',
  templateUrl: './product-supermarket-card.component.html',
  styleUrls: ['./product-supermarket-card.component.scss']
})
export class ProductSupermarketCardComponent {

  @Input() producto!: SupermarketProductCard;

}
