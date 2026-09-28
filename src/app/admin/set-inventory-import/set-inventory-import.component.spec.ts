import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetInventoryImportComponent } from './set-inventory-import.component';

describe('SetInventoryImportComponent', () => {
  let component: SetInventoryImportComponent;
  let fixture: ComponentFixture<SetInventoryImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetInventoryImportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetInventoryImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
