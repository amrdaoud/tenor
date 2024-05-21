import { TestBed } from '@angular/core/testing';

import { KpiBuilderService } from './kpi-builder.service';

describe('KpiBuilderService', () => {
  let service: KpiBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
