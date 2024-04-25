import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationContainerComponent } from './operation-container.component';

describe('OperationContainerComponent', () => {
  let component: OperationContainerComponent;
  let fixture: ComponentFixture<OperationContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OperationContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
