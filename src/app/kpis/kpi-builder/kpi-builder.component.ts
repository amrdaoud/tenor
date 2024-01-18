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
import { MatStepperModule } from '@angular/material/stepper';
import { ExtraField } from '../../common/generic';
import { FormControl, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { Unsubscriber } from 'techteec-lib/common';

@Component({
  selector: 'app-kpi-builder',
  standalone: true,
  imports: [
    MatGridListModule,
    CounterSideListComponent,
    KpiSideListComponent,
    MatCardModule,
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
  ],
  templateUrl: './kpi-builder.component.html',
  styleUrl: './kpi-builder.component.scss',
})
export class KpiBuilderComponent extends Unsubscriber {
  extraFields: ExtraField[] = [];
  Name: any;
  ngOnInit(): void {}
  frm = new FormGroup<any>({});
  constructor() {
    super();
    this.kpiService
      .getExtraFields()
      .pipe(
        tap((extraFields: ExtraField[]) => {
          extraFields.forEach((field) => {
            this.frm.addControl(field.id.toString(), new FormControl());
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
  }
  public kpiService = inject(KpiService);

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  submit() {
    this.kpiService.submit(this.frm.value, this.Name);
  }
}
