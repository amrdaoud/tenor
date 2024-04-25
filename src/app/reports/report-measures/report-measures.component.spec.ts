import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportMeasuresComponent } from './report-measures.component';

describe('ReportMeasuresComponent', () => {
  let component: ReportMeasuresComponent;
  let fixture: ComponentFixture<ReportMeasuresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportMeasuresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportMeasuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
