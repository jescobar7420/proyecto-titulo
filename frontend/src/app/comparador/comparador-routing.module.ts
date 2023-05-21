import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';

const rutas: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'featured-products', component: ProductListComponent },
      { path: ':id', component: ProductDetailsComponent },
      { path: '**', redirectTo: 'featured-products' }
    ]
  }
];



@NgModule({
  imports: [
    RouterModule.forChild( rutas )
  ],
  exports: [
    RouterModule
  ]
})
export class ComparadorRoutingModule { }
