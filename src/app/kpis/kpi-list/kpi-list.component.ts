import { Component, inject } from '@angular/core';
import { KpiService } from '../kpi.service';
import { btns, columns, filters } from '../kpi.const';
import { KpiListViewModel } from '../kpi';
import { MatGridListModule } from '@angular/material/grid-list';
import { DataTableComponent } from 'techteec-lib/components/data-table';
import { GeneralFilterModel } from 'techteec-lib/components/data-table/src/data-table.model';
import { Unsubscriber } from 'techteec-lib/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'amr-kpi-list',
  standalone: true,
  imports: [CommonModule, MatGridListModule, DataTableComponent],
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
  changed(filter: GeneralFilterModel) {
    this._otherSubscription = this.kpiService.getByFilter(filter).subscribe(x => {
      this.data = x.data;
      this.dataSize = x.dataSize;
    })
  }
}
