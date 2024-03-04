import { Component, OnInit, inject } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { CounterSideListComponent } from '../../counters/counter-side-list/counter-side-list.component';
import { KpiSideListComponent } from '../kpi-side-list/kpi-side-list.component';
import { MatCardModule } from '@angular/material/card';
import {
  MatFormFieldControl,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { KpiService } from '../kpi.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { OperatorsComponent } from '../../operators/operators.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { InputComponent, SelectComponent } from 'techteec-lib/controls';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ExtraField } from '../../common/generic';
import {
  FormControl,
  FormGroup,
  RequiredValidator,
  Validators,
} from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { Unsubscriber } from 'techteec-lib/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-kpi-builder',
  standalone: true,
  imports: [
    MatGridListModule,
    CounterSideListComponent,
    KpiSideListComponent,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    OperatorsComponent,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatTabsModule,
    MatChipsModule,
    DragDropModule,
    MatTooltipModule,
    InputComponent,
    SelectComponent,
    MatMenuModule,
    MatStepperModule,
    ReactiveFormsModule,
    FormsModule,
    MatProgressBarModule,
    MatDividerModule,
    MatSnackBarModule,
  ],
  templateUrl: './kpi-builder.component.html',
  styleUrl: './kpi-builder.component.scss',
})
export class KpiBuilderComponent extends Unsubscriber implements OnInit {
  public kpiService = inject(KpiService);
  public loadingList = this.kpiService.loadingDownload$;
  extraFields: ExtraField[] = [];
  Name: any;
  deviceId: any;
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(
      (x: any) => (this.deviceId = x.params.deviceId)
    );
  }
  frm = new FormGroup<any>({});
  constructor(
    private SnakBar: MatSnackBar,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.kpiService
      .getExtraFields()
      .pipe(
        tap((extraFields: ExtraField[]) => {
          extraFields.forEach((field) => {
            this.frm.addControl(
              field.id.toString(),
              new FormControl('', Validators.required)
            );
          });
        }),
        tap(
          (extraFields: ExtraField[]) => (
            (this.extraFields = extraFields), console.log(this.extraFields)
          )
        ),
        switchMap(() => this.frm.valueChanges),
        startWith(this.frm.value),
        distinctUntilChanged(),
        debounceTime(400),
        tap(() => this.frm.get('pageIndex')?.setValue(0, { emitEvent: false }))
      )
      .subscribe((c: any) => {});

    this.kpiService.kpiResult = [];
  }

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  setIsPublic(isPublic: boolean) {
    console.log(isPublic);
  }

  submit() {
    this.kpiService.submit(this.frm.value, this.Name, this.deviceId);
  }
  CheckFormatValidation(stepper: MatStepper) {
    this.kpiService
      .CheckFormatValidation(
        this.kpiService.initObject([], '1234', this.deviceId)
      )
      .subscribe(
        (x) => {
          console.log(x);
          this.kpiService.isValid = x;
          if (this.kpiService.isValid)
            setTimeout(() => {
              stepper.next();
            }, 1000);
          else this.SnakBar.open(this.kpiService.isValid, 'close');
        },
        (error: any) => {
          this.SnakBar.open('KPI format is invalid', 'close');
        }
      );
  }
  drop(event: any) {
    this.kpiService.isValid = false;
    this.kpiService.drop(event);
  }
  removeItem(event: any, index: number) {
    this.kpiService.isValid = false;
    this.kpiService.removeItem(event, index);
  }
}
