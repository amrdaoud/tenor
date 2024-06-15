import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDataTableComponent } from './report-data-table.component';

describe('ReportDataTableComponent', () => {
  let component: ReportDataTableComponent;
  let fixture: ComponentFixture<ReportDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportDataTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
