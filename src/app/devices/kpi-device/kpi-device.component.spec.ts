import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiDeviceComponent } from './kpi-device.component';

describe('KpiDeviceComponent', () => {
  let component: KpiDeviceComponent;
  let fixture: ComponentFixture<KpiDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiDeviceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KpiDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
