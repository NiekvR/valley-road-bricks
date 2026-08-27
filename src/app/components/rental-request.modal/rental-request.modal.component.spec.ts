import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalRequestModalComponent } from './rental-request.modal.component';

describe('RentalRequestModalComponent', () => {
  let component: RentalRequestModalComponent;
  let fixture: ComponentFixture<RentalRequestModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentalRequestModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentalRequestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
