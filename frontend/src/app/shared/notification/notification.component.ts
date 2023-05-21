import { Component, Inject, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

import { CartService } from 'src/app/comparador/services/cart.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  
  @Output() trashClick = new EventEmitter<void>();

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public producto: { id: number, nombre: string },
    private snackBarRef: MatSnackBarRef<NotificationComponent>,
    private cartService: CartService
  ) { }

  ngOnInit() {}

  onTrashClick() {
    this.cartService.decreaseProductQuantity(this.producto.id);
    this.snackBarRef.dismiss();
  }
}
