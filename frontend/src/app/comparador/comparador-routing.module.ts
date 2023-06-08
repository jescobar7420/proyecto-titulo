import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { ProductFilterComponent } from './pages/product-filter/product-filter.component';
import { FeaturedProductsComponent } from './pages/featured-products/featured-products.component';
import { PriceComparisonComponent } from './pages/price-comparison/price-comparison.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

const rutas: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'featured-products', component: FeaturedProductsComponent },
      { path: 'search-filter', component: ProductFilterComponent },
      { path: 'price-comparison', component: PriceComparisonComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'producto/:id', component: ProductDetailsComponent },
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
