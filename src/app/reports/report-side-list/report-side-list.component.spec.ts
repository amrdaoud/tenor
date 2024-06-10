import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSideListComponent } from './report-side-list.component';

describe('ReportSideListComponent', () => {
  let component: ReportSideListComponent;
  let fixture: ComponentFixture<ReportSideListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportSideListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportSideListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
