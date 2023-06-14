import { Component, Input, OnInit } from '@angular/core';
import { SupermarketComparisonCard } from '../../interfaces/supermarket-comparison-card';
import { DialogProductsSupermarketComponent } from '../dialog-products-supermarket/dialog-products-supermarket.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { QuotationService } from '../../services/quotation.service';
import { DialogSaveQuotationComponent } from '../dialog-save-quotation/dialog-save-quotation.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationSucessSaveQuotationComponent } from '../../notifications/notification-sucess-save-quotation/notification-sucess-save-quotation.component';
import { NotificationErrorSaveQuotationComponent } from '../../notifications/notification-error-save-quotation/notification-error-save-quotation.component';
import { Router } from '@angular/router';
import { SupermarketService } from '../../services/supermarket.service';

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

  constructor(public dialogProductsSupermarket: MatDialog,
              public authService: AuthService,
              private cartService: CartService,
              private quotationService: QuotationService,
              private dialogSaveQuotation: MatDialog,
              private router: Router,
              private snackBar: MatSnackBar,
              private supermarketService: SupermarketService) { }

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

  openDialogProductsSupermarket(id_supermercado: number) {
    const dialogProductsSupermarketConfig = new MatDialogConfig();

    dialogProductsSupermarketConfig.disableClose = false;
    dialogProductsSupermarketConfig.autoFocus = true;

    dialogProductsSupermarketConfig.data = {
      id_supermercado: id_supermercado.toString()
    }

    this.dialogProductsSupermarket.open(DialogProductsSupermarketComponent, dialogProductsSupermarketConfig);
  }

  saveQuotationUser(id_supermercado: number) {
    const id_usuario = this.authService.userId;
    if (id_usuario) {
      let title = '';

      const dialogRef = this.dialogSaveQuotation.open(DialogSaveQuotationComponent, {
        data: { title: title },
      });

      dialogRef.afterClosed().subscribe(result => {
        title = result;
        if (title) {
          this.supermarketService.getPricesProductSupermarket(id_supermercado, this.cartService.getProductIds())
          .subscribe(prices => {
            const fecha_actual = this.obtenerFechaActual();
            const monto_total = this.supermarket_comparison.total_value;
            const ids_products = this.cartService.getProductIds().split(",").map(Number);
            const quantities = this.cartService.getProductQuantities().split(",").map(Number);
            const pricesList = prices.split(",").map(Number);

            this.quotationService.postInsertQuotation(id_usuario, id_supermercado, title, monto_total, fecha_actual, ids_products, quantities, pricesList)
              .subscribe({
                next: (response) => {
                  this.openSnackBarSucess();
                  this.cartService.clearCart();
                  this.router.navigate(['/comparador/user/quotations']);
                },
                error: (error) => {
                  this.openSnackBarError();
                  console.error(error);
                  this.router.navigate(['/comparador/featured-products']);
                }
              })
            
            });
        }
      });
    }
    return null;
  }

  obtenerFechaActual(): string {
    const fechaActual: Date = new Date();

    const dia: number = fechaActual.getDate();
    const mes: number = fechaActual.getMonth() + 1;
    const anio: number = fechaActual.getFullYear();

    const diaFormateado: string = dia < 10 ? `0${dia}` : `${dia}`;
    const mesFormateado: string = mes < 10 ? `0${mes}` : `${mes}`;

    const fechaFormateada: string = `${diaFormateado}/${mesFormateado}/${anio}`;
    return fechaFormateada;
  }

  openSnackBarSucess() {
    this.snackBar.openFromComponent(NotificationSucessSaveQuotationComponent, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
  
  openSnackBarError() {
    this.snackBar.openFromComponent(NotificationErrorSaveQuotationComponent, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}
