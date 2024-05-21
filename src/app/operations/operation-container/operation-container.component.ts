import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, inject } from '@angular/core';
import { TreeNodeViewModel, enOPerationTypes } from '../../common/generic';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { AbstractControl, FormControl } from '@angular/forms';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { ENTER } from '@angular/cdk/keycodes';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { OperatorsService } from '../../operators/operators.service';
import { Observable, Subscription, tap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { KpiService } from '../../kpis/kpi.service';
import { OperationService } from '../operation.service';

@Component({
  selector: 'app-operation-container',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule,MatChipsModule,CdkDrag, CdkDropList, CdkDropListGroup, MatGridListModule, MatProgressBarModule, MatButtonModule,MatMenuModule, MatIconModule],
  templateUrl: './operation-container.component.html',
  styleUrl: './operation-container.component.scss'
})
export class OperationContainerComponent implements OnChanges {
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;
  @Input() draggedCounter!: TreeNodeViewModel | null;
  contextMenuPosition = { x: '0px', y: '0px' };
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER] as const;
  private operatorsService = inject(OperatorsService);
  private kpiService = inject(KpiService);
  private operationService = inject(OperationService);
  private validationSub = new Subscription();
  private operatorsAndFunctions: TreeNodeViewModel[] = [];
  operatorsAndFunctions$ = this.operatorsService.getOperatorsAndFunctions(). pipe(tap(x => this.operatorsAndFunctions = x));
  loadingOperatorsAndFunctions$ = this.operatorsService.loadingOperatorsAndFunctions$;
  
  @Input({required: true}) chipItems: TreeNodeViewModel[] = [];
  @Input() autoValidate = false;
  @Input() operationFormControl!: AbstractControl;
  @Input() operationValidationMessage: string | undefined = '';
  @Input() loadingValidate$!: Observable<boolean>;
  @Output() changed = new EventEmitter();
  @ViewChild('formula') formulaContainer!: CdkDropList;
  ngOnChanges(changes: SimpleChanges): void {
    if(this.chipItems && this.chipItems.length > 0) {
      this.validateOperation();
    }
  }
  drop(event: CdkDragDrop<TreeNodeViewModel[]>) {
    console.log(event.previousContainer);
    console.log(event.previousIndex);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const clone = {...event.previousContainer.data[event.previousIndex]};
      event.container.data.splice(event.currentIndex, 0, clone);
    }
    if(this.autoValidate) {
      this.validateOperation();
      return;
    }
    this.operationFormControl?.setValue('');
    this.operationValidationMessage = '';
  }
  add(event: MatChipInputEvent): void {
    if(isNaN(+event.value)) {
      const operatorOrFunction = this.operatorsAndFunctions.find(x => x.name.toLowerCase() === event.value.toLowerCase());
      if(operatorOrFunction) {
        this.chipItems.push(operatorOrFunction);
        event.chipInput!.clear();
      }
      return;
    }
    const value = (event.value || '').trim();
    if (value) {
      this.chipItems.push({id: 0, name: event.value, type: 'number', hasChild:false, childs: []});
    }
    event.chipInput!.clear();
    if(this.autoValidate) {
      this.validateOperation();
      return;
    }
    this.operationFormControl?.setValue('');
    this.operationValidationMessage = '';
  }
  remove(index: number): void {
    if (index >= 0) {
      this.chipItems.splice(index, 1);
    }
    if(this.autoValidate) {
      this.validateOperation();
      return;
    }
    this.operationFormControl?.setValue('');
    this.operationValidationMessage = '';
  }
  edit(index: number, event: MatChipEditedEvent) {
    const value = event.value.trim();
    if (!value) {
      this.remove(index);
      return;
    }
    if (index >= 0) {
      this.chipItems[index].name = value;
    }
    if(this.autoValidate) {
      this.validateOperation();
      return;
    }
    this.operationFormControl?.setValue('');
    this.operationValidationMessage = '';
  }
  addOperatorOrFunction(node: TreeNodeViewModel) {
    this.chipItems.push(node);
    if(this.autoValidate) {
      this.validateOperation();
      return;
    }
    this.operationFormControl?.setValue('');
    this.operationValidationMessage = '';
  }
  onContextMenu(event: MouseEvent, item: TreeNodeViewModel, index: number) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item': item, 'index': index };
    this.contextMenu.menu?.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  validateOperation() {
    this.validationSub.unsubscribe();
    this.operationFormControl.setValue('');
    try {
      const kpi = {
        id: 0,
        name: 'New KPI',
        deviceId: 1,
        operation: {
          id: 0,
          order: 0,
          type: enOPerationTypes.voidFunction,
          childs: this.operationService.buildKpiOperationChilds(this.chipItems)
        }
      }
      this.validationSub = this.kpiService.validateKpi(kpi).subscribe(x => {
        if (x.data) {
          this.operationFormControl.setValue(kpi.operation);
          this.operationValidationMessage = '';
        } else {
          this.operationValidationMessage = x.message
        }
      });
    }
    catch (error) {
      if (error instanceof Error) {
        this.operationValidationMessage = error.message;
      }
    }
  }
}
