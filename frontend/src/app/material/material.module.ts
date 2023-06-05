import { NgModule } from '@angular/core';

import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  exports: [
      MatBadgeModule,
      MatButtonModule,
      MatCardModule,
      MatCheckboxModule,
      MatDialogModule,
      MatFormFieldModule,
      MatGridListModule,
      MatIconModule,
      MatInputModule,
      MatListModule,
      MatPaginatorModule,
      MatProgressSpinnerModule,
      MatRadioModule,
      MatSelectModule,
      MatSliderModule,
      MatSidenavModule,
      MatSnackBarModule,
      MatToolbarModule,
      ReactiveFormsModule
  ]
})
export class MaterialModule { }
