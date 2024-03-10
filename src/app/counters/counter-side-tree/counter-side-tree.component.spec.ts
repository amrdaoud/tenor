import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterSideTreeComponent } from './counter-side-tree.component';

describe('CouterSideTreeComponent', () => {
  let component: CounterSideTreeComponent;
  let fixture: ComponentFixture<CounterSideTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterSideTreeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CounterSideTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
