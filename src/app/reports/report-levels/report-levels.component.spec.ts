import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportLevelsComponent } from './report-levels.component';

describe('ReportLevelsComponent', () => {
  let component: ReportLevelsComponent;
  let fixture: ComponentFixture<ReportLevelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportLevelsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
