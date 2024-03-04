import { Component, inject } from '@angular/core';
import { KpiService } from '../kpi.service';
import { btns, columns, filters, menuBtns } from '../kpi.const';
import { KpiBindingModel, KpiListViewModel } from '../kpi';
import { MatGridListModule } from '@angular/material/grid-list';
import { DataTableComponent } from 'techteec-lib/components/data-table';
import {
  DataTableFilter,
  GeneralFilterModel,
} from 'techteec-lib/components/data-table/src/data-table.model';
import { Unsubscriber } from 'techteec-lib/common';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { KpiFormComponent } from '../kpi-form/kpi-form.component';
import { Router } from '@angular/router';
import { ConfirmService } from 'techteec-lib/dialogs-and-templates';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ExtraField } from '../../common/generic';
import {
  tap,
  switchMap,
  startWith,
  distinctUntilChanged,
  debounceTime,
  of,
} from 'rxjs';
@Component({
  selector: 'amr-kpi-list',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    DataTableComponent,
    MatDialogModule,
  ],
  templateUrl: './kpi-list.component.html',
  styleUrl: './kpi-list.component.scss',
})
export class KpiListComponent extends Unsubscriber {
  private kpiService = inject(KpiService);
  loadingList$ = this.kpiService.loadingList$;
  private confirm = inject(ConfirmService);
  columns = columns;
  filters = filters;
  btns = btns;
  menuBtns = menuBtns;
  data: KpiListViewModel[] = [];
  dataSize = 0;
  latestFilter!: GeneralFilterModel;
  private dialog = inject(MatDialog);
  frm = new FormGroup<any>({});
  extraFields: ExtraField[] = [];
  ///add other properties
  ///
  ///////////////////////
  constructor(private route: Router) {
    super();
    this.kpiService
      .getExtraFields()
      .pipe(
        tap((extraFields: any[]) => {
          (extraFields[0].Type = 'select'), this.filters.push(extraFields[0]);
          extraFields.forEach((field: any) => {
            this.frm.addControl(
              field.id.toString(),
              new FormControl('', Validators.required)
            );
          });
        }),
        switchMap(() => this.frm.valueChanges),
        startWith(this.frm.value),
        distinctUntilChanged(),
        debounceTime(400),
        tap(() => {
          this.frm.get('pageIndex')?.setValue(0, { emitEvent: false });
        })
      )
      .subscribe((c: any) => {});
    const dynamicFilters: DataTableFilter[] = [
      {
        Type: 'select',
        ControlName: 'extraField',
        Label: 'Extra Field',
        PlaceHolder: 'Extra Field',
        Data$: of([
          { name: 'a', value: '1' },
          { name: 'b', value: '2' },
          { name: 'c', value: '3' },
          { name: '7', value: '3' },
        ]),
        DisplayProperty: 'name',
        ValueProperty: 'value',
      },
    ];
    this.filters.push(this.frm.value);
  }
  changed(filter: GeneralFilterModel) {
    console.log('filter', filter);
    this.latestFilter = filter;
    this._otherSubscription = this.kpiService
      .getByFilter(filter)
      .subscribe((x) => {
        this.data = x.data;
        this.dataSize = x.dataSize;
      });
  }
  rowClick(event: any) {
    if (confirm('Are yous sure you want to Edit KPI'))
      this.route.navigate(['kpis/edit', event.id]);
  }
  btnClicked(btnIndex: number) {
    // if (btnIndex == 0) {
    //   this._otherSubscription = this.dialog
    //     .open(KpiFormComponent, { panelClass: 'techteec-form-dialog' })
    //     .afterClosed()
    //     .pipe(
    //       filter((bindingObject) => bindingObject),
    //       switchMap((bindingObject: KpiBindingModel) =>
    //         this.kpiService.addElement(bindingObject)
    //       )
    //     )
    //     .subscribe((viewObject) => this.changed(this.latestFilter));
    // }
    this.route.navigateByUrl('/kpis/builder');
  }
  menuCLicked(event: { index: number; target: KpiListViewModel }) {
    if (event.index === 0) {
      // this.confirm.open({ Title: 'KPI Update', Message: 'Are you sure?' }).pipe(
      //   filter(result => result)
      // ).subscribe(() =>)
      this.route.navigate(['kpis/edit', event.target.id]);
    }
  }
}
