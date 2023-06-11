import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { SupermarketProductCard } from '../../interfaces/supermarket-product-card';
import { QuotationService } from '../../services/quotation.service';

@Component({
  selector: 'app-list-products-quotation',
  templateUrl: './list-products-quotation.component.html',
  styleUrls: ['./list-products-quotation.component.scss']
})
export class ListProductsQuotationComponent implements OnInit {
  @Input() id_cotizacion!: number | null;

  productsCard: SupermarketProductCard[] = [];
  loading: boolean = false;

  constructor(private quotationService: QuotationService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id_cotizacion']) {
        this.getProducts();
    }
}

  getProducts(): void {
    if (this.id_cotizacion) {
      this.loading = true;
      this.quotationService.getProductsQuotation(this.id_cotizacion)
        .subscribe(producto => {
          this.productsCard = producto;
          this.loading = false;
        });
    } else {
      this.productsCard = [];
    }
  }
}
