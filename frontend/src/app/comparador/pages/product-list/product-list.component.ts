import { Component, Input } from '@angular/core';
import { ProductCard } from '../../interfaces/product-card';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {

  @Input() productos: ProductCard[] = [];
}
