import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationErrorRegisterComponent } from './notification-error-register.component';

describe('NotificationErrorRegisterComponent', () => {
  let component: NotificationErrorRegisterComponent;
  let fixture: ComponentFixture<NotificationErrorRegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationErrorRegisterComponent]
    });
    fixture = TestBed.createComponent(NotificationErrorRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
