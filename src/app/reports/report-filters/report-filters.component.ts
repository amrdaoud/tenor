import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnChanges, QueryList, SimpleChanges, ViewChildren, inject } from '@angular/core';
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
import { filter, map} from 'rxjs';
import { ReportFilterControlComponent } from "../report-filter-control/report-filter-control.component";
import { ReportBuilderService } from '../report-builder/report-builder.service';
import { MatStepperNext, MatStepperPrevious } from '@angular/material/stepper';
@Component({
    selector: 'app-report-filters',
    standalone: true,
    templateUrl: './report-filters.component.html',
    styleUrl: './report-filters.component.scss',
    imports: [CommonModule, MatSidenavModule, MatCardModule,
      MatIconModule, MatListModule, CdkDropList, MatCheckboxModule,
      ReactiveFormsModule, LevelsSideTreeComponent, MatButtonModule,
      ReportFilterControlComponent, MatStepperNext, MatStepperPrevious]
})
export class ReportFiltersComponent implements AfterViewInit {
  @Input() formArray = new FormArray<any>([]);
  @Input() measuresArray = new FormArray<any>([]);
  dropContainers:  CdkDropList<any>[] = [];
  @ViewChildren('levelDropper') levelDroppers!: QueryList<CdkDropList<any>>;
  reportMeasures: ReportMeasureDto[] = [];
  private reportBuilder = inject(ReportBuilderService);
  ngAfterViewInit(): void {
    this.updateContainers();
    this.measuresArray.valueChanges.pipe(
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
    this.formArray.markAsDirty();
  }
  addContainer(event: CdkDragDrop<never[]>) {    
    this.formArray.push(this.reportBuilder.createFilterContainerFormFromDrop(event));
    this.updateContainers();
    this.formArray.markAsDirty();
  }
  addFilter(event: CdkDragDrop<never[]>, containerFormIndex: number) {
    this.getFilterFormArray(containerFormIndex).push(this.reportBuilder.createFilterFormFromDrop(event));
    this.formArray.markAsDirty();
  }
  updateContainers() {
    setTimeout(() => {
      const containers = this.levelDroppers.map(x => x);
      this.dropContainers = containers;
    }, 500);
    // this.changed();
  }
  removeFilter(containerIndex: number, filterIndex: number) {
    this.getFilterFormArray(containerIndex).removeAt(filterIndex);
    this.formArray.markAsDirty();
  }
  removeContainer(containerIndex: number) {
    this.formArray.removeAt(containerIndex);
    this.formArray.markAsDirty();
  }
}
