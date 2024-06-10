import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFilterControlComponent } from './report-filter-control.component';

describe('ReportFilterControlComponent', () => {
  let component: ReportFilterControlComponent;
  let fixture: ComponentFixture<ReportFilterControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportFilterControlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportFilterControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
