import { Component, inject } from '@angular/core';
import { KpiService } from '../kpi.service';
import { btns, columns, filters } from '../kpi.const';
import { KpiBindingModel, KpiListViewModel } from '../kpi';
import { MatGridListModule } from '@angular/material/grid-list';
import { DataTableComponent } from 'techteec-lib/components/data-table';
import { DataTableFilter, GeneralFilterModel } from 'techteec-lib/components/data-table/src/data-table.model';
import { Unsubscriber } from 'techteec-lib/common';
import { CommonModule } from '@angular/common';
import { filter, of, switchMap } from 'rxjs';
import { MatDialog, MatDialogModule }  from '@angular/material/dialog';
import { KpiFormComponent } from '../kpi-form/kpi-form.component';

@Component({
  selector: 'amr-kpi-list',
  standalone: true,
  imports: [CommonModule, MatGridListModule, DataTableComponent, MatDialogModule],
  templateUrl: './kpi-list.component.html',
  styleUrl: './kpi-list.component.scss'
})
export class KpiListComponent extends Unsubscriber {
  private kpiService = inject(KpiService);
  loadingList$ = this.kpiService.loadingList$;
  columns = columns;
  filters = filters;
  btns = btns;
  data: KpiListViewModel[] = [];
  dataSize = 0;
  latestFilter!: GeneralFilterModel;
  private dialog = inject(MatDialog);
  ///add other properties
  ///
  ///////////////////////
  constructor() {
    super();
    const dynamicFilters: DataTableFilter[] = [
      {
        Type: 'select',
        ControlName: 'extraField',
        Label: 'Extra Field',
        PlaceHolder: 'Extra Field',
        Data$: of([
          {name: 'a', value: '1'},
          {name: 'b', value: '2'},
          {name: 'c', value: '3'}
        ]),
        DisplayProperty: 'name',
        ValueProperty: 'value'
      }
    ];
    this.filters.push(...dynamicFilters)
  }
  changed(filter: GeneralFilterModel) {
    this.latestFilter = filter;
    this._otherSubscription = this.kpiService.getByFilter(filter).subscribe(x => {
      this.data = x.data;
      this.dataSize = x.dataSize;
    })
  }
  btnClicked(btnIndex: number) {
    if(btnIndex == 0) {
      this._otherSubscription = this.dialog.open(KpiFormComponent, {panelClass: 'techteec-form-dialog'}).afterClosed().pipe(
        filter(bindingObject => bindingObject),
        switchMap((bindingObject: KpiBindingModel) => this.kpiService.addElement(bindingObject))
      ).subscribe(viewObject => this.changed(this.latestFilter))
    }
  }
}
