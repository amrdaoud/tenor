import { Component, inject } from '@angular/core';
import { KpiService } from '../kpi.service';
import { btns, columns, menuBtns } from '../kpi.const';
import { KpiFilterModel, KpiListViewModel } from '../kpi';
import { MatGridListModule } from '@angular/material/grid-list';
import { DataTableComponent } from 'techteec-lib/components/data-table';
import {
  DataTableFilter,
  GeneralFilterModel,
} from 'techteec-lib/components/data-table/src/data-table.model';
import { Unsubscriber } from 'techteec-lib/common';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmService } from 'techteec-lib/dialogs-and-templates';
import { ExtraField } from '../../common/generic';
import { Observable, filter, map, of, switchMap } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'amr-kpi-list',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    DataTableComponent,
    MatDialogModule,
    MatProgressBarModule
  ],
  templateUrl: './kpi-list.component.html',
  styleUrl: './kpi-list.component.scss',
})
export class KpiListComponent extends Unsubscriber {
  private kpiService = inject(KpiService);
  private router = inject(Router);
  private confirm = inject(ConfirmService);
  private snackBar = inject(MatSnackBar);
  loadingValue$ = this.kpiService.loadingValue$;
  loadingList$ = this.kpiService.loadingList$;
  loadingMenuElements$ = this.kpiService.loadingMenuElements$;
  columns = columns;
  btns = btns;
  menuBtns = menuBtns;
  data: KpiListViewModel[] = [];
  dataSize = 0;
  latestFilter!: GeneralFilterModel;
  loadingExtraFields$ = this.kpiService.loadingExtraFields$;
  filters$: Observable<DataTableFilter[]> = this.kpiService.getExtraFields().pipe(
    map(fields => {
      const allFilters: DataTableFilter[] = [];
      fields.forEach(element => {
        allFilters.push({
          ControlName: element.name,
          PlaceHolder: element.name,
          IsMulti: element.type === 'MultiSelectList',
          Type: element.type === 'Text' ? 'input' : 'select',
          Label: element.name,
          Data$: of(element.content)
        })
      });
      return allFilters;
    })
  )
  changed(filter: any) {
    this.latestFilter = filter;
    if(!filter.extraFields) {
      const kpiFilter = Object.keys(filter);
      const extraFieldsKeys = kpiFilter.filter(x => !['PageIndex',
      'PageSize'	,
      'SearchQuery'	,
      'SortActive'	,
      'SortDirection',
      'DeviceId'
      ].includes(x));
      const extraFields: { [key: string]: any; } = {};
      extraFieldsKeys.forEach(field => {
        extraFields[field] = filter[field]
      })
      filter.extraFields = extraFields;
    }
    this._otherSubscription = this.kpiService
      .getByFilter(filter)
      .subscribe((x) => {
        this.data = x.data;
        this.dataSize = x.dataSize;
      });
  }
  btnClicked(btnIndex: number) {
    this.router.navigateByUrl('/kpis/builder');
  }
  menuCLicked(event: { index: number; target: KpiListViewModel; targetIndex: number }) {
    if (event.index === 0) {
      this.router.navigate(['kpis/edit', event.target.id]);
    } else if(event.index === 1) {
      this.kpiService.getData(event.target.id, event.targetIndex).subscribe(x => {
        if(x) {
          this.snackBar.open(`Kpi value for yesterday between 00 and 01 is: ${x.data}`, 'Dismiss');
        }
      })
    } else if(event.index === 2) {
      this.confirm.open({Title: 'Deleting KPI', Message: `Are you sure you want to delete "${event.target.name}" KPI?`, MatColor: 'warn' }).pipe(
        filter(result => result),
        switchMap(() => this.kpiService.deleteKpi(event.target.id, event.targetIndex))
      ).subscribe(x => {
        if(x) {
          this.snackBar.open('KPI deleted successfully', 'Dismiss', {duration: 2000});
          this.changed(this.latestFilter);
        }
      })
    }
  }
}
