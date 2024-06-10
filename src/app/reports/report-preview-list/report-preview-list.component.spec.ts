import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPreviewListComponent } from './report-preview-list.component';

describe('ReportPreviewListComponent', () => {
  let component: ReportPreviewListComponent;
  let fixture: ComponentFixture<ReportPreviewListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportPreviewListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportPreviewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
