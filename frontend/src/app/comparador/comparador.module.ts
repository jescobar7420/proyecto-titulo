import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { MaterialModule } from '../material/material.module';
import { ComparadorRoutingModule } from './comparador-routing.module';

import { FeaturedProductsComponent } from './pages/featured-products/featured-products.component';
import { HomeComponent } from './pages/home/home.component';
import { NotificationComponent } from './notification/notification.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { PriceComparisonComponent } from './pages/price-comparison/price-comparison.component';
import { ProductCardComponent } from './pages/product-card/product-card.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductFilterComponent } from './pages/product-filter/product-filter.component';
import { ThousandsSeparatorPipe } from './pipes/thousands-separator.pipe';
import { CapitalizeFirstLetterPipe } from './pipes/capitalize-first-letter.pipe';
import { SupermarketComparisonCardComponent } from './pages/supermarket-comparison-card/supermarket-comparison-card.component';

@NgModule({
  declarations: [
    FeaturedProductsComponent,
    HomeComponent,
    NotificationComponent,
    ProductDetailsComponent,
    PriceComparisonComponent,
    ProductCardComponent,
    ProductListComponent,
    ProductFilterComponent,
    ThousandsSeparatorPipe,
    CapitalizeFirstLetterPipe,
    SupermarketComparisonCardComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    NgSelectModule,
    MaterialModule,
    ComparadorRoutingModule
  ]
})
export class ComparadorModule { }
