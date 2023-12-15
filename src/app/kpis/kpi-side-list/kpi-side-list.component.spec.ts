import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiSideListComponent } from './kpi-side-list.component';

describe('KpiSideListComponent', () => {
  let component: KpiSideListComponent;
  let fixture: ComponentFixture<KpiSideListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiSideListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KpiSideListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
