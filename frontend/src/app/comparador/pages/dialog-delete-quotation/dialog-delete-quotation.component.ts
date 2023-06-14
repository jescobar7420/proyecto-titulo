import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-delete-quotation',
  templateUrl: './dialog-delete-quotation.component.html',
  styleUrls: ['./dialog-delete-quotation.component.scss']
})
export class DialogDeleteQuotationComponent {
  constructor(public dialogRef: MatDialogRef<DialogDeleteQuotationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
