import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupermarketComparisonCardComponent } from './supermarket-comparison-card.component';

describe('SupermarketComparisonCardComponent', () => {
  let component: SupermarketComparisonCardComponent;
  let fixture: ComponentFixture<SupermarketComparisonCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupermarketComparisonCardComponent]
    });
    fixture = TestBed.createComponent(SupermarketComparisonCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
