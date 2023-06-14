import { Component, ViewChildren, QueryList, ViewChild, Input } from '@angular/core';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { QuotationService } from '../../services/quotation.service';
import { QuotationDetail } from '../../interfaces/quotation-detail';
import { AuthService } from '../../services/auth.service';
import { SupermarketProductCard } from '../../interfaces/supermarket-product-card';
import { MatDialog } from '@angular/material/dialog';
import { DialogRelistQuotationComponent } from '../dialog-relist-quotation/dialog-relist-quotation.component';
import { ProductosService } from '../../services/productos.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { DialogDeleteQuotationComponent } from '../dialog-delete-quotation/dialog-delete-quotation.component';

@Component({
  selector: 'app-quotation-details',
  templateUrl: './quotation-details.component.html',
  styleUrls: ['./quotation-details.component.scss']
})
export class QuotationDetailsComponent {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChildren(MatExpansionPanel) panels!: QueryList<MatExpansionPanel>;
  @Input() listQuotations!: QuotationDetail[];

  id_cotizacion: number | null = null;
  listProductsQuotation: SupermarketProductCard[] = [];

  constructor(private quotationService: QuotationService,
              private authService: AuthService,
              public dialogRelistQuotation: MatDialog,
              public dialogDeleteQuotation: MatDialog,
              private productosService: ProductosService,
              private cartService: CartService,
              private router: Router) { }

  ngAfterViewInit(): void {
    this.panels.toArray().forEach((panel, index) => {
      panel.opened.subscribe(() => {
        this.id_cotizacion = this.listQuotations[index].id_cotizacion;
        this.getProductsForQuotation(this.id_cotizacion);
      });

      panel.closed.subscribe(() => {
        this.id_cotizacion = null;
        this.listProductsQuotation = [];
      });
    });
  }

  getProductsForQuotation(id_cotizacion: number | null): void {
    if (id_cotizacion) {
      this.quotationService.getProductsQuotation(id_cotizacion)
        .subscribe(productos => {
          this.listProductsQuotation = productos;
        });
    }
  }

  addQuotationToCart(id_cotizacion: number, nombre: string) {
    this.quotationService.getListProductsQuotation(id_cotizacion)
      .subscribe(list_ids => {
        const ids_productos = list_ids;

        const dialogRef = this.dialogRelistQuotation.open(DialogRelistQuotationComponent, {
          data: { title: nombre },
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === true) {
            this.productosService.getProductCartByListId(ids_productos)
              .subscribe(productos => {
                this.cartService.addProductListToCart(productos);
                this.router.navigate(['comparador/price-comparison']);
              })
          }
        })
      })
  }

  deleteQuotation(id_cotizacion: number, nombre: string) {
    const dialogRef = this.dialogDeleteQuotation.open(DialogDeleteQuotationComponent, {
      data: { title: nombre },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.quotationService.deleteQuotation(id_cotizacion)
          .subscribe(result => {
            const id_usuario = this.authService.userId;
            if (id_usuario) {
              this.quotationService.getQuotationUser(id_usuario!)
                .subscribe(quotations => {
                  this.listQuotations = quotations;
                });
            }
          }, error => {
            console.error(error);
          });
      }
    })
  }
}
