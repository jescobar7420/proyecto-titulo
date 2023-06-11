import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProductsQuotationComponent } from './list-products-quotation.component';

describe('ListProductsQuotationComponent', () => {
  let component: ListProductsQuotationComponent;
  let fixture: ComponentFixture<ListProductsQuotationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListProductsQuotationComponent]
    });
    fixture = TestBed.createComponent(ListProductsQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
