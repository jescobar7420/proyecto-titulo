import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';


@NgModule({
  exports: [
      MatButtonModule,
      MatCardModule,
      MatIconModule,
      MatInputModule,
      MatListModule,
      MatSelectModule,
      MatSidenavModule,
      MatToolbarModule
  ]
})
export class MaterialModule { }
