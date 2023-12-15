import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterSideListComponent } from './counter-side-list.component';

describe('CounterSideListComponent', () => {
  let component: CounterSideListComponent;
  let fixture: ComponentFixture<CounterSideListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterSideListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CounterSideListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
