import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupermarketsMapComponent } from './supermarkets-map.component';

describe('SupermarketsMapComponent', () => {
  let component: SupermarketsMapComponent;
  let fixture: ComponentFixture<SupermarketsMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupermarketsMapComponent]
    });
    fixture = TestBed.createComponent(SupermarketsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
