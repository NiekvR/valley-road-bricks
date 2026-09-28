import { TestBed } from '@angular/core/testing';

import { SetInventoryImportService } from './set-inventory-import.service';

describe('SetInventoryImportService', () => {
  let service: SetInventoryImportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetInventoryImportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
