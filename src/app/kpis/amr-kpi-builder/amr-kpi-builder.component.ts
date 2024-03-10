import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, map, switchMap, tap } from 'rxjs';
import { CounterSideTreeComponent } from "../../counters/counter-side-tree/counter-side-tree.component";
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ExtraField, TreeNodeViewModel, enOPerationTypes } from '../../common/generic';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, copyArrayItem, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ENTER } from '@angular/cdk/keycodes';
import { OperatorsService } from '../../operators/operators.service';
import { MatButtonModule } from '@angular/material/button';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { KpiBuilderService } from './kpi-builder.service';
import { KpiService } from '../kpi.service';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent, SelectComponent } from 'techteec-lib/controls';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { KpiSideListComponent } from "../kpi-side-list/kpi-side-list.component";
import { KpiViewModel } from '../kpi';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Unsubscriber } from 'techteec-lib/common';
@Component({
    selector: 'app-amr-kpi-builder',
    standalone: true,
    templateUrl: './amr-kpi-builder.component.html',
    styleUrl: './amr-kpi-builder.component.scss',
    providers: [KpiBuilderService],
    imports: [CommonModule, MatCardModule, MatGridListModule,
        CounterSideTreeComponent, MatSidenavModule, MatTabsModule,
        MatFormFieldModule, MatInputModule, MatChipsModule, MatIconModule, MatMenuModule,
        CdkDrag, CdkDropList, CdkDropListGroup, MatStepperModule, MatProgressBarModule,
        MatButtonModule, ReactiveFormsModule, SelectComponent, InputComponent, MatSlideToggleModule, KpiSideListComponent, MatProgressSpinnerModule]
})
export class AmrKpiBuilderComponent extends Unsubscriber {
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  get extraFieldsArray(): FormGroup[] {
    return (this.frm.get('kpiFields') as FormArray).controls as FormGroup[]
  }
  getFieldObject(i: number): ExtraField {
    return this.extraFieldsArray[i].value as ExtraField;
  }
  frm!: FormGroup;
  addOnBlur = true;
  operationValidationMessage: string | undefined = '';
  readonly separatorKeysCodes = [ENTER] as const;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private operatorsService = inject(OperatorsService);
  private kpiBuilderService = inject(KpiBuilderService);
  private kpiService = inject(KpiService);
  operatorsAndFunctions$ = this.operatorsService.getOperatorsAndFunctions();
  loadingOperatorsAndFunctions$ = this.operatorsService.loadingOperatorsAndFunctions$;
  loadingKpi$ = this.kpiService.loadingElement$;
  loadingAdd$ = this.kpiService.loadingAdd$;
  loadingExtraFields$ = this.kpiService.loadingExtraFields$;
  loadingValidate$ = this.kpiService.loadingValidate$;
  kpiChipItems: TreeNodeViewModel[] = [];
  deviceId: number = 0;
  kpi!: KpiViewModel;
  deviceId$: Observable<number> = this.route.paramMap.pipe(
    switchMap((param: ParamMap) => {
      if(+param.get('deviceId')!) {
        return this.kpiService.getExtraFields().pipe(
          tap(extraFields => this.frm = this.kpiBuilderService.createKpiForm(+param.get('deviceId')!, extraFields)),
          map(() => +param.get('deviceId')!)
        )
      } else {
        return this.kpiService.getById(+param.get('kpiId')!).pipe(
          tap((kpi: KpiViewModel) => this.kpi = kpi),
          tap(() => this.kpiChipItems = this.kpiBuilderService.destroyKpiOperationChilds(this.kpi?.operations?.childs!)),
          switchMap(() => this.kpiService.getExtraFields()),
          tap(extraFields => this.frm = this.kpiBuilderService.createKpiForm(this.kpi.deviceId!, extraFields,this.kpi)),
          
          map(() => this.kpi.deviceId!)
        )
      }
    }),
    tap(d => {
      this.deviceId = d;
    })
  )

  addMeasure(element: TreeNodeViewModel) {
    this.kpiChipItems.push(element)
    this.frm.get('operation')?.setValue('')
  }
  drop(event: CdkDragDrop<TreeNodeViewModel[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

    }
    this.frm.get('operation')?.setValue('');
    this.operationValidationMessage = '';
  }
  add(event: MatChipInputEvent): void {
    if(isNaN(+event.value)) {
      return;
    }
    const value = (event.value || '').trim();
    if (value) {
      this.kpiChipItems.push({id: 0, name: event.value, type: 'number', hasChild:false, children: []});
    }
    event.chipInput!.clear();
    this.frm.get('operation')?.setValue('');
    this.operationValidationMessage = '';
  }
  remove(index: number): void {
    if (index >= 0) {
      this.kpiChipItems.splice(index, 1);
    }
    this.frm.get('operation')?.setValue('');
    this.operationValidationMessage = '';
  }
  edit(index: number, event: MatChipEditedEvent) {
    const value = event.value.trim();
    if (!value) {
      this.remove(index);
      return;
    }
    if (index >= 0) {
      this.kpiChipItems[index].name = value;
    }
    this.frm.get('operation')?.setValue('');
    this.operationValidationMessage = '';
  }
  addOperatorOrFunction(node: TreeNodeViewModel) {
    this.kpiChipItems.push(node);
    this.frm.get('operation')?.setValue('');
    this.operationValidationMessage = '';
  }
  buildFormula(stepper: MatStepper) {
    const kpi = {
      id: 0,
      name: 'New KPI',
      deviceId: this.deviceId,
      operation: {
        id: 0,
        order: 0,
        type: enOPerationTypes.voidFunction,
        childs: this.kpiBuilderService.buildKpiOperationChilds(this.kpiChipItems)}
    }
    this._otherSubscription = this.kpiService.validateKpi(kpi).subscribe(x => {
      if(x.data) {
        this.frm.get('operation')?.setValue(kpi.operation);
        this.frm.get('deviceId')?.setValue(this.deviceId);
        this.operationValidationMessage = '';
        stepper.next();
      } else {
        this.operationValidationMessage = x.message
      }
    });
  }
  submit() {
    if(this.frm.invalid) {
      return;
    }
    if(this.kpi) {
      this._otherSubscription = this.kpiService.editKpi(this.frm.value).subscribe(x => {
        if(x) {
          this.router.navigateByUrl('/kpis/list')
        }
      })
    }
    else {
      this._otherSubscription = this.kpiService.submitKpi(this.frm.value).subscribe(x => {
        if(x) {
          this.router.navigateByUrl('/kpis/list')
        }
      });
    }
    
  }
  onContextMenu(event: MouseEvent, item: TreeNodeViewModel, index: number) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item': item, 'index': index };
    this.contextMenu.menu?.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  
}

