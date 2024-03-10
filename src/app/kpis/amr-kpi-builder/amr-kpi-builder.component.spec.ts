import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmrKpiBuilderComponent } from './amr-kpi-builder.component';

describe('AmrKpiBuilderComponent', () => {
  let component: AmrKpiBuilderComponent;
  let fixture: ComponentFixture<AmrKpiBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmrKpiBuilderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AmrKpiBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
