import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogProductsSupermarketComponent } from './dialog-products-supermarket.component';

describe('DialogProductsSupermarketComponent', () => {
  let component: DialogProductsSupermarketComponent;
  let fixture: ComponentFixture<DialogProductsSupermarketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogProductsSupermarketComponent]
    });
    fixture = TestBed.createComponent(DialogProductsSupermarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
