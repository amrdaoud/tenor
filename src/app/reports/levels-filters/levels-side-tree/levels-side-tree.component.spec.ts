import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelsSideTreeComponent } from './levels-side-tree.component';

describe('LevelsSideTreeComponent', () => {
  let component: LevelsSideTreeComponent;
  let fixture: ComponentFixture<LevelsSideTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelsSideTreeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LevelsSideTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
