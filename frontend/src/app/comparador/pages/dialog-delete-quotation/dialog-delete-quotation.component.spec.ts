import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteQuotationComponent } from './dialog-delete-quotation.component';

describe('DialogDeleteQuotationComponent', () => {
  let component: DialogDeleteQuotationComponent;
  let fixture: ComponentFixture<DialogDeleteQuotationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogDeleteQuotationComponent]
    });
    fixture = TestBed.createComponent(DialogDeleteQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
