import { Component, Input, OnInit } from '@angular/core';
import { SupermarketComparisonCard } from '../../interfaces/supermarket-comparison-card';

@Component({
  selector: 'app-supermarket-comparison-card',
  templateUrl: './supermarket-comparison-card.component.html',
  styleUrls: ['./supermarket-comparison-card.component.scss']
})
export class SupermarketComparisonCardComponent implements OnInit {

  @Input() supermarket_comparison!: SupermarketComparisonCard;
  
  num_available: string = '';
  num_on_offer: string = '';
  num_out_of_stock: string = '';
  num_not_distributed: string = '';
  
  ngOnInit(): void {
    /* Disponibles */
    if (this.supermarket_comparison.num_available == 1) {
      this.num_available = `${this.supermarket_comparison.num_available} producto`;
    } else if (this.supermarket_comparison.num_available == 0) {
      this.num_available = `Ningún producto`;
    } else {
      this.num_available = `${this.supermarket_comparison.num_available} productos`;
    }
    
    /* Ofertas */
    if (this.supermarket_comparison.num_on_offer == 1) {
      this.num_on_offer = `${this.supermarket_comparison.num_on_offer} producto`;
    } else if (this.supermarket_comparison.num_on_offer == 0) {
      this.num_on_offer = `Ningún producto`;
    } else {
      this.num_on_offer = `${this.supermarket_comparison.num_on_offer} productos`;
    }
  
    /* Stock */
    if (this.supermarket_comparison.num_out_of_stock == 1) {
      this.num_out_of_stock = `${this.supermarket_comparison.num_out_of_stock} producto`;
    } else if (this.supermarket_comparison.num_out_of_stock == 0) {
      this.num_out_of_stock = `Ningún producto`;
    } else {
      this.num_out_of_stock = `${this.supermarket_comparison.num_out_of_stock} productos`;
    }
    
    /* Distribución */
    if (this.supermarket_comparison.num_not_distributed == 1) {
      this.num_not_distributed = `${this.supermarket_comparison.num_not_distributed} producto`;
    } else if (this.supermarket_comparison.num_not_distributed == 0) {
      this.num_not_distributed = `Ningún producto`;
    } else {
      this.num_not_distributed = `${this.supermarket_comparison.num_not_distributed} productos`;
    }
  }
}
