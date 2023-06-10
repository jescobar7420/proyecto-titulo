import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationSucessSaveQuotationComponent } from './notification-sucess-save-quotation.component';

describe('NotificationSucessSaveQuotationComponent', () => {
  let component: NotificationSucessSaveQuotationComponent;
  let fixture: ComponentFixture<NotificationSucessSaveQuotationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationSucessSaveQuotationComponent]
    });
    fixture = TestBed.createComponent(NotificationSucessSaveQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
