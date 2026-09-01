import { TestBed } from '@angular/core/testing';

import { LegoControlService } from './lego-control.service';

describe('LegoControlService', () => {
  let service: LegoControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LegoControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
