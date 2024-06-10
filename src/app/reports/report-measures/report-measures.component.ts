import { AfterViewInit, Component, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import { ReportMeasureDto } from '../report';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OperationContainerComponent } from "../../operations/operation-container/operation-container.component";
import { MatIconModule } from '@angular/material/icon';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { TreeNodeViewModel, enLogicalOperator } from '../../common/generic';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { CounterSideTreeComponent } from '../../counters/counter-side-tree/counter-side-tree.component';
import { KpiSideListComponent } from '../../kpis/kpi-side-list/kpi-side-list.component';
import { OperatorsService } from '../../operators/operators.service';
import { MatStepperNext } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReportBuilderService } from '../report-builder/report-builder.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-report-measures',
  standalone: true,
  templateUrl: './report-measures.component.html',
  styleUrl: './report-measures.component.scss',
  imports: [CommonModule, FormsModule, MatTabsModule, MatExpansionModule,
            MatFormFieldModule, MatInputModule, OperationContainerComponent,
            MatIconModule, CdkDrag, CdkDragHandle, CdkDropList, MatButtonModule,
            ReactiveFormsModule, MatSelectModule, MatSidenavModule, CounterSideTreeComponent,
            KpiSideListComponent, MatStepperNext,MatTooltipModule]
})
export class ReportMeasuresComponent implements AfterViewInit {
  @Input() formArray = new FormArray<any>([]);
  dropContainers:  CdkDropList<any>[] = []
  // @Output() dropContainersChanged = new EventEmitter<CdkDropList<any>[]>();
  // @Output() formArrayChanged = new EventEmitter<FormArray<any>>();
  private operatorService = inject(OperatorsService);
  private reportBuilder = inject(ReportBuilderService);
  logicalOperators$ = this.operatorService.logicalOperators$;
  @ViewChildren('operationContainer') operationContainers!: QueryList<OperationContainerComponent>;
  @ViewChild('measureDropper') measureDropper!: CdkDropList<any>;
  isDragging = false;
  error$ = this.formArray.valueChanges.pipe(
    map(() => {
      if(this.formArray.hasError('measureDuplication')) {
        return 'Duplication in measures display name!'
      } else {return ''}})
  );
  addNewMeasure() {
    this.formArray.push(this.reportBuilder.createEmptyMeasureForm());
    this.updateContainers();
  }
  removeMeasure(i: number) {
    this.formArray.removeAt(i);
    this.updateContainers();
  }
  dropMeasure(event: CdkDragDrop<never[]>) {
    const clone = { ...event.previousContainer.data[event.previousIndex] as any } as TreeNodeViewModel;
    this.addMeasure(clone);
    this.updateContainers();
    this.formArray.markAsDirty();
  }
  rearrangeMeasures(event: CdkDragDrop<any[]>) {
    const currentMEasure = this.formArray.at(event.previousIndex);
    this.formArray.removeAt(event.previousIndex);
    this.formArray.insert(event.currentIndex, currentMEasure);
    this.formArray.markAsDirty();
  }
  addMeasure(item: TreeNodeViewModel, index?: number) {
    this.formArray.insert(index ?? this.formArray.length,this.reportBuilder.createMeasureFormFromDrop(item));
    this.updateContainers();
    this.formArray.markAsDirty();
  }
  updateContainers() {
    setTimeout(() => {
      const containers = this.operationContainers.map(x => x.formulaContainer);
      this.dropContainers = [this.measureDropper,...containers];
    }, 500);
    // this.changed();
  }
  ngAfterViewInit(): void {
    this.updateContainers();
  }
  // changed() {
  //   this.formArrayChanged.emit(new FormArray<any>([]))
  // }
  get formArrayControls(): FormGroup[] {
    return this.formArray.controls.map(x => x as FormGroup);
  }
  getHavingFormArray(i: number): FormArray {
    return this.formArrayControls[i].get('havings') as FormArray;
  }
  getHavingControls(i: number): FormGroup[] {
    return this.getHavingFormArray(i).controls.map(x => x as FormGroup);
  }
  addHaving(i: number) {
    this.getHavingFormArray(i).push(this.reportBuilder.createHavingForm());
    this.formArray.markAsDirty();
  }
  removeHaving(measureIndex: number, havingIndex: number) {
    this.getHavingFormArray(measureIndex).removeAt(havingIndex);
    this.formArray.markAsDirty();
  }
  

}
