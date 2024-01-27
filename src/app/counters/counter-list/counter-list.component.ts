import { Component, inject } from '@angular/core';
import { CounterService } from '../counter.service';
import { btns, columns, filters } from '../counter.const';
import { CounterListViewModel } from '../counter';
import { MatGridListModule } from '@angular/material/grid-list';
import { DataTableComponent } from 'techteec-lib/components/data-table';
import {
  DataTableFilter,
  GeneralFilterModel,
} from 'techteec-lib/components/data-table/src/data-table.model';
import { Unsubscriber } from 'techteec-lib/common';
import { CommonModule } from '@angular/common';
import { filter, of, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CounterFormComponent } from '../counter-form/counter-form.component';

@Component({
  selector: 'amr-counter-list',
  standalone: true,
  imports: [CommonModule, MatGridListModule, DataTableComponent],
  templateUrl: './counter-list.component.html',
  styleUrl: './counter-list.component.scss',
})
export class CounterListComponent extends Unsubscriber {
  private counterService = inject(CounterService);
  loadingList$ = this.counterService.loadingList$;
  columns = columns;
  filters = filters;
  btns = btns;
  data: CounterListViewModel[] = [];
  dataSize = 0;
  latestFilter!: GeneralFilterModel;
  private dialog = inject(MatDialog);
  ///add other properties

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
          { name: 'a', value: '1' },
          { name: 'b', value: '2' },
          { name: 'c', value: '3' },
        ]),
        DisplayProperty: 'name',
        ValueProperty: 'value',
      },
    ];
    this.filters.push(...dynamicFilters);
  }
  changed(filter: GeneralFilterModel) {
    this._otherSubscription = this.counterService
      .getByFilter(filter)
      .subscribe((x) => {
        this.data = x.data;
        this.dataSize = x.dataSize;
      });
  }
  btnClicked(btnIndex: number) {
    if (btnIndex == 0) {
      this._otherSubscription = this.dialog
        .open(CounterFormComponent, { panelClass: 'techteec-form-dialog' })
        .afterClosed()
        .pipe(
          filter((bindingObject) => bindingObject),
          switchMap((bindingObject) =>
            this.counterService.addElement(bindingObject)
          )
        )
        .subscribe((viewObject) => this.changed(this.latestFilter));
    }
  }
}
