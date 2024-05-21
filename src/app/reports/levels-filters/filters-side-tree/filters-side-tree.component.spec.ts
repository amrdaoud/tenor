import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersSideTreeComponent } from './filters-side-tree.component';

describe('FiltersSideTreeComponent', () => {
  let component: FiltersSideTreeComponent;
  let fixture: ComponentFixture<FiltersSideTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltersSideTreeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FiltersSideTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
