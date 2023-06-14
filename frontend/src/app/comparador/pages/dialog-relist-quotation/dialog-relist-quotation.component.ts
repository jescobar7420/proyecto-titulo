import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-relist-quotation',
  templateUrl: './dialog-relist-quotation.component.html',
  styleUrls: ['./dialog-relist-quotation.component.scss']
})
export class DialogRelistQuotationComponent {
  constructor(public dialogRef: MatDialogRef<DialogRelistQuotationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
