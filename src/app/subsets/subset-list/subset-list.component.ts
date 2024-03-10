import { Component, inject } from '@angular/core';
import { SubsetService } from '../subset.service';
import { btns, columns, filters } from '../subset.const';
import { SubsetListViewModel } from '../subset';
import { MatGridListModule } from '@angular/material/grid-list';
import { DataTableComponent } from 'techteec-lib/components/data-table';
import { GeneralFilterModel } from 'techteec-lib/components/data-table/src/data-table.model';
import { Unsubscriber } from 'techteec-lib/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subset-list',
  standalone: true,
  imports: [CommonModule, MatGridListModule, DataTableComponent],
  templateUrl: './subset-list.component.html',
  styleUrl: './subset-list.component.scss'
})
export class SubsetListComponent extends Unsubscriber {
  private subsetService = inject(SubsetService);
  loadingList$ = this.subsetService.loadingList$;
  columns = columns;
  filters = [];
  btns = [];
  data: SubsetListViewModel[] = [];
  dataSize = 0;
  changed(filter: GeneralFilterModel) {
    this._otherSubscription = this.subsetService.getByFilter(filter).subscribe(x => {
      this.data = x.data;
      this.dataSize = x.dataSize;
    })
  }
}
