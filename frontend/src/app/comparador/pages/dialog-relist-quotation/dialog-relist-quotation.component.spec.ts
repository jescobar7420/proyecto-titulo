import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRelistQuotationComponent } from './dialog-relist-quotation.component';

describe('DialogRelistQuotationComponent', () => {
  let component: DialogRelistQuotationComponent;
  let fixture: ComponentFixture<DialogRelistQuotationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogRelistQuotationComponent]
    });
    fixture = TestBed.createComponent(DialogRelistQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
