import { Component, HostListener, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, map, of, switchMap, tap } from 'rxjs';
import { CounterSideTreeComponent } from "../../counters/counter-side-tree/counter-side-tree.component";
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ExtraField, TreeNodeViewModel, enOPerationTypes } from '../../common/generic';
import { CdkDropListGroup} from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { KpiService } from '../kpi.service';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent, SelectComponent } from 'techteec-lib/controls';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuTrigger } from '@angular/material/menu';
import { KpiSideListComponent } from "../kpi-side-list/kpi-side-list.component";
import { KpiViewModel } from '../kpi';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Unsubscriber } from 'techteec-lib/common';
import { OperationService } from '../../operations/operation.service';
import { OperationContainerComponent } from "../../operations/operation-container/operation-container.component";
import { ComponentCanDeactivate } from '../../app-core/guards/unsaved.guard';
import { SharedFormControlsComponent } from "../../shared/shared-form-controls/shared-form-controls.component";
import { KpiBuilderService } from './kpi-builder.service';
@Component({
    selector: 'app-amr-kpi-builder',
    standalone: true,
    templateUrl: './kpi-builder.component.html',
    styleUrl: './kpi-builder.component.scss',
    imports: [CommonModule,
        CounterSideTreeComponent, MatSidenavModule, MatTabsModule,
        MatFormFieldModule, MatInputModule, MatIconModule,
        CdkDropListGroup, MatStepperModule,
        MatButtonModule, ReactiveFormsModule, SelectComponent, InputComponent, MatSlideToggleModule, KpiSideListComponent, MatProgressSpinnerModule, OperationContainerComponent, SharedFormControlsComponent]
})
export class KpiBuilderComponent extends Unsubscriber implements OnInit, ComponentCanDeactivate {
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return this.frm.pristine || this.submitted ? true : false;
  }
  submitted = false;
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;
  get extraFieldsArray(): FormGroup[] {
    return (this.frm.get('kpiFields') as FormArray).controls as FormGroup[]
  }
  getFieldObject(i: number): ExtraField {
    return this.extraFieldsArray[i].value as ExtraField;
  }
  frm!: FormGroup;
  operationValidationMessage: string | undefined = '';
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private operationService = inject(OperationService);
  private kpiBuilderService = inject(KpiBuilderService);
  private kpiService = inject(KpiService);
  @ViewChild(OperationContainerComponent) operationContainer!: OperationContainerComponent;
  loadingKpi$ = this.kpiService.loadingElement$;
  loadingAdd$ = this.kpiService.loadingAdd$;
  loadingExtraFields$ = this.kpiService.loadingExtraFields$;
  loadingValidate$ = this.kpiService.loadingValidate$;
  draggedCounter!: TreeNodeViewModel | null;
  kpiChipItems: TreeNodeViewModel[] = [];
  kpi!: KpiViewModel;
  ngOnInit(): void {
    this._otherSubscription = this.route.paramMap.pipe(
      switchMap((param: ParamMap) => {
        if (+param.get('kpiId')!) {
          return this.kpiService.getById(+param.get('kpiId')!).pipe(
            tap((kpi: KpiViewModel) => this.kpi = kpi),
            switchMap(e => this.kpiService.getExtraFields(e.deviceId!)),
            map(e => this.kpiBuilderService.createKpiForm(this.kpi,e)),
            tap(() => this.kpiChipItems = this.operationService.destroyKpiOperationChilds(this.kpi?.operations?.childs!)),
            tap(() => this.buildFormula())
          )
        } else {
          return of(this.kpiBuilderService.createKpiForm())
        }
      }),
      tap(x => {
        this.frm = x;
        this.frm.markAsPristine();
      }),
      switchMap(x => this.frm?.get('deviceId')?.valueChanges!),
      switchMap(e => this.kpiService.getExtraFields(e)),
      tap(e => {this.kpiBuilderService.resetExtraFields(this.frm,e,this.kpi)}),
    ).subscribe();
  }
  addMeasure(element: TreeNodeViewModel) {
    this.kpiChipItems.push({ ...element })
    this.frm.get('operation')?.setValue('');
    this.frm.markAsDirty();
  }
  buildFormula(stepper?: MatStepper) {
    try {
      const kpi = {
        id: 0,
        name: 'New KPI',
        deviceId: 1,
        operation: {
          id: 0,
          order: 0,
          type: enOPerationTypes.voidFunction,
          childs: this.operationService.buildKpiOperationChilds(this.kpiChipItems)
        }
      }
      this._otherSubscription = this.kpiService.validateKpi(kpi).subscribe(x => {
        if (x.data) {
          this.frm.get('operation')?.setValue(kpi.operation);
          this.operationValidationMessage = '';
          stepper?.next();
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
  submit() {
    if (this.frm.invalid) {
      return;
    }
    if (this.kpi) {
      this._otherSubscription = this.kpiService.editKpi(this.frm.value).subscribe(x => {
        if (x) {
          this.submitted = true;
          this.router.navigateByUrl('/kpis/list')
        }
      })
    }
    else {
      this._otherSubscription = this.kpiService.submitKpi(this.frm.value).subscribe(x => {
        if (x) {
          this.submitted = true;
          this.router.navigateByUrl('/kpis/list')
        }
      });
    }

  }
}

