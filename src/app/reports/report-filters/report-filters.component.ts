import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnChanges, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TreeNodeViewModel, enLogicalOperator } from '../../common/generic';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LevelsSideTreeComponent } from "../levels-filters/levels-side-tree/levels-side-tree.component";
import { ReportMeasureDto } from '../report';
import { filter, map, startWith, tap } from 'rxjs';
@Component({
    selector: 'app-report-filters',
    standalone: true,
    templateUrl: './report-filters.component.html',
    styleUrl: './report-filters.component.scss',
    imports: [CommonModule, MatSidenavModule, MatCardModule, MatIconModule, MatListModule, CdkDropList, MatCheckboxModule, ReactiveFormsModule, LevelsSideTreeComponent, MatButtonModule]
})
export class ReportFiltersComponent implements AfterViewInit {
  @Input() formArray = new FormArray<any>([]);
  @Input() measuresArray = new FormArray<any>([]);
  dropContainers:  CdkDropList<any>[] = [];
  @ViewChildren('levelDropper') levelDroppers!: QueryList<CdkDropList<any>>;
  reportMeasures: ReportMeasureDto[] = [];
  ngAfterViewInit(): void {
    this.updateContainers();
    this.measuresArray.valueChanges.pipe(
      tap(x => console.log(x)),
      filter(() => this.measuresArray.valid),
      map(x => x as ReportMeasureDto[])
    ).subscribe(x => this.reportMeasures = x);
  }
  get formArrayControls(): FormGroup[] {
    return this.formArray.controls.map(x => x as FormGroup);
  }
  get enLogicalOperator(): typeof enLogicalOperator {
    return enLogicalOperator; 
  }
  getFilterFormArray(i: number): FormArray {
    return this.formArrayControls[i].get('reportFilters') as FormArray;
  }
  getFilterControls(i: number): FormGroup[] {
    return this.getFilterFormArray(i).controls.map(x => x as FormGroup);
  }
  changeLogicalOpertor(containerForm: FormGroup) {
    containerForm.get('logicalOperator')?.setValue(containerForm.get('logicalOperator')?.value === 1 ? 0 : 1);
  }
  addContainer(event: CdkDragDrop<never[]>) {    
    const f = { ...event.previousContainer.data[event.previousIndex] as any } as TreeNodeViewModel;
    this.formArray.push(new FormGroup({
      id: new FormControl(0, Validators.required),
      logicalOperator: new FormControl(enLogicalOperator.AND, Validators.required),
      reportFilters: new FormArray([new FormGroup({
        id: new FormControl(0, Validators.required),
        name: new FormControl(f.name), //Must get the name of this filter
        logicalOperator: new FormControl(enLogicalOperator.AND, Validators.required),
        value: new FormControl(),
        levelId: new FormControl(f.id, Validators.required),
        isMandatory: new FormControl(true, Validators.required),
        isVariable: new FormControl(false, Validators.required)
      })]),
    }));
    this.updateContainers();
    
  }
  addFilter(event: CdkDragDrop<never[]>, containerFormIndex: number) {
    const f = { ...event.previousContainer.data[event.previousIndex] as any } as TreeNodeViewModel;
    this.getFilterFormArray(containerFormIndex).push(new FormGroup({
      id: new FormControl(0, Validators.required),
      name: new FormControl(f.name) , //Must get the name of this filter
      logicalOperator: new FormControl(enLogicalOperator.AND, Validators.required),
      value: new FormControl(),
      levelId: new FormControl(f.id, Validators.required),
      isMandatory: new FormControl(true, Validators.required),
      isVariable: new FormControl(false, Validators.required)
  }));
  }
  updateContainers() {
    setTimeout(() => {
      const containers = this.levelDroppers.map(x => x);
      this.dropContainers = containers;
    }, 500);
    // this.changed();
  }
}
