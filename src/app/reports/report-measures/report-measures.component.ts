import { AfterViewInit, Component, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
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
import { HighlighterDirective } from 'techteec-lib/directives';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-report-measures',
  standalone: true,
  templateUrl: './report-measures.component.html',
  styleUrl: './report-measures.component.scss',
  imports: [CommonModule, FormsModule, MatExpansionModule, MatFormFieldModule, MatInputModule, OperationContainerComponent, MatIconModule, CdkDrag, CdkDragHandle, CdkDropList, MatButtonModule, ReactiveFormsModule, MatSelectModule]
})
export class ReportMeasuresComponent implements AfterViewInit {
  @Input() formArray = new FormArray<any>([]);
  @Output() dropContainersChanged = new EventEmitter<CdkDropList<any>[]>();
  @Output() formArrayChanged = new EventEmitter<FormArray<any>>();
  @ViewChildren('operationContainer') operationContainers!: QueryList<OperationContainerComponent>;
  @ViewChild('measureDropper') measureDropper!: CdkDropList<any>;
  isDragging = false;
  addNewMeasure() {
    this.formArray.push(new FormGroup({
      id: new FormControl(0),
      displayName: new FormControl('', Validators.required),
      operation: new FormControl(null,Validators.required),
      chipItems: new FormControl([]),
      havings: new FormArray([])
    }));
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
  }
  rearrangeMeasures(event: CdkDragDrop<any[]>) {
    const currentMEasure = this.formArray.at(event.previousIndex);
    this.formArray.removeAt(event.previousIndex);
    this.formArray.insert(event.currentIndex, currentMEasure)
    //moveItemInArray(event.container.data, event.previousIndex, event.previousIndex);
  }
  addMeasure(item: TreeNodeViewModel, index?: number) {
    this.formArray.insert(index ?? this.formArray.length,new FormGroup({
      id: new FormControl(0),
      displayName: new FormControl(item.name, Validators.required),
      operation: new FormControl(null,Validators.required),
      chipItems: new FormControl([item], Validators.required),
      havings: new FormArray([])
    }));
    this.updateContainers();
  }
  updateContainers() {
    setTimeout(() => {
      const containers = this.operationContainers.map(x => x.formulaContainer);
      this.dropContainersChanged.emit([this.measureDropper,...containers]);
    }, 500);
    this.changed();
  }
  ngAfterViewInit(): void {
    this.updateContainers();
  }
  changed() {
    this.formArrayChanged.emit(new FormArray<any>([]))
  }
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
    this.getHavingFormArray(i).push(new FormGroup({
      id: new FormControl(0),
      operatorId: new FormControl('', Validators.required),
      logicOpt: new FormControl(enLogicalOperator.AND, Validators.required),
      value: new FormControl('', Validators.required)
    }));
  }
  removeHaving(measureIndex: number, havingIndex: number) {
    this.getHavingFormArray(measureIndex).removeAt(havingIndex);
  }

}
