import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedFormControlsComponent } from './shared-form-controls.component';

describe('SharedFormControlsComponent', () => {
  let component: SharedFormControlsComponent;
  let fixture: ComponentFixture<SharedFormControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedFormControlsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SharedFormControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
