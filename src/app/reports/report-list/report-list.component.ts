import { Component, inject } from '@angular/core';
import { ReportService } from '../report.service';
import { btns, columns, menuBtns } from '../report.const';
import { ReportDto } from '../report';
import { DataTableFilter, GeneralFilterModel } from 'techteec-lib/components/data-table/src/data-table.model';
import { Observable, filter, map, of, switchMap } from 'rxjs';
import { Unsubscriber } from 'techteec-lib/common';
import { Router } from '@angular/router';
import { ConfirmService } from 'techteec-lib/dialogs-and-templates';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { DataTableComponent } from 'techteec-lib/components/data-table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, MatGridListModule, DataTableComponent],
  templateUrl: './report-list.component.html',
  styleUrl: './report-list.component.scss'
})
export class ReportListComponent extends Unsubscriber {
  private router = inject(Router);
  private reportService = inject(ReportService);
  private confirm = inject(ConfirmService);
  private snackBar = inject(MatSnackBar);
  loadingList$ = this.reportService.loadingList$;
  loadingMenuElements$ = this.reportService.loadingMenuElements$;
  columns = columns;
  btns = btns;
  menuBtns = menuBtns;
  data: ReportDto[] = [];
  dataSize = 0;
  latestFilter!: GeneralFilterModel;
  loadingExtraFields$ = this.reportService.loadingExtraFields$;
  filters$: Observable<DataTableFilter[]> = this.reportService.getExtraFields().pipe(
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
    this._otherSubscription = this.reportService
      .getByFilter(filter)
      .subscribe((x) => {
        this.data = x.data;
        this.dataSize = x.dataSize;
      });
  }
  btnClicked(btnIndex: number) {
    this.router.navigateByUrl('/reports/builder');
  }
  menuCLicked(event: { index: number; target: ReportDto; targetIndex: number }) {
    if (event.index === 0) {
      this.router.navigate(['reports/edit', event.target.id]);
    } else if(event.index === 1) {
      this.confirm.open({Title: 'Deleting Report', Message: `Are you sure you want to delete "${event.target.name}" Report?`, MatColor: 'warn' }).pipe(
        filter(result => result),
        switchMap(() => this.reportService.deleteReport(event.target.id, event.targetIndex))
      ).subscribe(x => {
        if(x) {
          this.snackBar.open('Report deleted successfully', 'Dismiss', {duration: 2000});
          this.changed(this.latestFilter);
        }
      })
    }
  }
}
