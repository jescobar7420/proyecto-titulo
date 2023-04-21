import { Component, Input, OnInit } from '@angular/core';
import { ProductCard } from '../../interfaces/product-card';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  
  @Input() producto!: ProductCard;
   
}

  
  


