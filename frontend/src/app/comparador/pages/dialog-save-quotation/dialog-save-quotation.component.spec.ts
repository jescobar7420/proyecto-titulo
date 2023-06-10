import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSaveQuotationComponent } from './dialog-save-quotation.component';

describe('DialogSaveQuotationComponent', () => {
  let component: DialogSaveQuotationComponent;
  let fixture: ComponentFixture<DialogSaveQuotationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogSaveQuotationComponent]
    });
    fixture = TestBed.createComponent(DialogSaveQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
