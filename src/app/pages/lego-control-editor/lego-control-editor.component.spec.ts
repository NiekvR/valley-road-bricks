import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegoControlEditorComponent } from './lego-control-editor.component';

describe('LegoControlEditorComponent', () => {
  let component: LegoControlEditorComponent;
  let fixture: ComponentFixture<LegoControlEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegoControlEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegoControlEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
