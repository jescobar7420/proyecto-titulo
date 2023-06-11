import { Component, OnInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { QuotationService } from '../../services/quotation.service';
import { QuotationDetail } from '../../interfaces/quotation-detail';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-quotation-details',
  templateUrl: './quotation-details.component.html',
  styleUrls: ['./quotation-details.component.scss']
})
export class QuotationDetailsComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChildren(MatExpansionPanel) panels!: QueryList<MatExpansionPanel>;
  listQuotations: QuotationDetail[] = [];
  id_cotizacion: number | null = null;
  
  constructor(private quotationService: QuotationService,
              private authService: AuthService) {}

  ngOnInit(): void {
    const id_usuario = this.authService.userId;
    this.quotationService.getQuotationUser(id_usuario!)
      .subscribe(quotations => {
        this.listQuotations = quotations; 
      });
  }

  ngAfterViewInit(): void {
    this.panels.changes.subscribe((r) => {
      this.panels.toArray().forEach((panel, index) => {
        panel.opened.subscribe(() => {
          this.id_cotizacion = this.listQuotations[index].id_cotizacion;
        });

        panel.closed.subscribe(() => {
          this.id_cotizacion = null;
        });
      });
    });
  }
}
