import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSupermarketCardComponent } from './product-supermarket-card.component';

describe('ProductSupermarketCardComponent', () => {
  let component: ProductSupermarketCardComponent;
  let fixture: ComponentFixture<ProductSupermarketCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductSupermarketCardComponent]
    });
    fixture = TestBed.createComponent(ProductSupermarketCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
