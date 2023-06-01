import { Component, Input, OnInit } from '@angular/core';
import { ProductCard } from '../../interfaces/product-card';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  @Input() productos: ProductCard[] = [];
  loading: boolean = false;
   
  constructor() {}
  
  ngOnInit(): void {
    
  }
}
