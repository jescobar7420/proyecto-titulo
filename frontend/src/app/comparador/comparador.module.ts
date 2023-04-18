import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '../material/material.module';
import { ComparadorRoutingModule } from './comparador-routing.module';

import { HomeComponent } from './pages/home/home.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { PriceComparisonComponent } from './pages/price-comparison/price-comparison.component';
import { ProductCardComponent } from './pages/product-card/product-card.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { NavbarComponent } from './pages/navbar/navbar.component';



@NgModule({
  declarations: [
    HomeComponent,
    ProductDetailsComponent,
    PriceComparisonComponent,
    ProductCardComponent,
    ProductListComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    ComparadorRoutingModule
  ]
})
export class ComparadorModule { }
