import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationErrorSaveQuotationComponent } from './notification-error-save-quotation.component';

describe('NotificationErrorSaveQuotationComponent', () => {
  let component: NotificationErrorSaveQuotationComponent;
  let fixture: ComponentFixture<NotificationErrorSaveQuotationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationErrorSaveQuotationComponent]
    });
    fixture = TestBed.createComponent(NotificationErrorSaveQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
