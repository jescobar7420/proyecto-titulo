import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserQuotationsComponent } from './user-quotations.component';

describe('UserQuotationsComponent', () => {
  let component: UserQuotationsComponent;
  let fixture: ComponentFixture<UserQuotationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserQuotationsComponent]
    });
    fixture = TestBed.createComponent(UserQuotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
