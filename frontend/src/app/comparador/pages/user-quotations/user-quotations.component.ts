import { Component, OnInit } from '@angular/core';
import { QuotationService } from '../../services/quotation.service';
import { AuthService } from '../../services/auth.service';
import { QuotationDetail } from '../../interfaces/quotation-detail';

@Component({
  selector: 'app-user-quotations',
  templateUrl: './user-quotations.component.html',
  styleUrls: ['./user-quotations.component.scss']
})
export class UserQuotationsComponent implements OnInit {

  listQuotations: QuotationDetail[] = [];
  selectedOption: string = '';

  constructor(private quotationService: QuotationService,
              private authService: AuthService) {}

  ngOnInit(): void {
    const id_usuario = this.authService.userId;
    if (id_usuario) {
      this.quotationService.getQuotationUser(id_usuario)
        .subscribe(quotations => {
          this.listQuotations = quotations;
        });
    }
  }
  
  onFilterClick() {
    const id_usuario = this.authService.userId;
    if (id_usuario) {
      this.quotationService.getQuotationUser(id_usuario, this.selectedOption)
        .subscribe(quotations => {
          this.listQuotations = quotations;
        });
    }
  }
}
