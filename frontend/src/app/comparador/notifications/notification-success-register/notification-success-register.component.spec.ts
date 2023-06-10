import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationSuccessRegisterComponent } from './notification-success-register.component';

describe('NotificationSuccessRegisterComponent', () => {
  let component: NotificationSuccessRegisterComponent;
  let fixture: ComponentFixture<NotificationSuccessRegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationSuccessRegisterComponent]
    });
    fixture = TestBed.createComponent(NotificationSuccessRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
