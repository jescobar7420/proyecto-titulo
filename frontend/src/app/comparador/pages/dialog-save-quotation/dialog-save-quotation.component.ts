import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog-save-quotation',
  templateUrl: './dialog-save-quotation.component.html',
  styleUrls: ['./dialog-save-quotation.component.scss']
})
export class DialogSaveQuotationComponent {
  quotationForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<DialogSaveQuotationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder) {
    this.quotationForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
