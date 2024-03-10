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
import { Observable, map, of } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
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
  loadingList$ = this.kpiService.loadingList$;
  columns = columns;
  btns = btns;
  menuBtns = menuBtns;
  data: KpiListViewModel[] = [];
  dataSize = 0;
  latestFilter!: GeneralFilterModel;
  private dialog = inject(MatDialog);
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
    this.latestFilter = filter;
    this._otherSubscription = this.kpiService
      .getByFilter(filter)
      .subscribe((x) => {
        this.data = x.data;
        this.dataSize = x.dataSize;
      });
  }
  btnClicked(btnIndex: number) {
    this.router.navigateByUrl('/kpis/devices');
  }
  menuCLicked(event: { index: number; target: KpiListViewModel }) {
    if (event.index === 0) {
      this.router.navigate(['kpis/edit', event.target.id]);
    }
  }
}
