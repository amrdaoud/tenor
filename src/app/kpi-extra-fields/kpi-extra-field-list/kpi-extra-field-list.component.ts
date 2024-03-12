import { Component, inject } from '@angular/core';
import { KpiExtraFieldService } from '../kpi-extra-field.service';
import { btns, columns, filters } from '../kpi-extra-field.const';
import { CreateExtraFieldViewModel } from '../kpi-extra-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { DataTableComponent } from 'techteec-lib/components/data-table';
import { DataTableFilter, GeneralFilterModel } from 'techteec-lib/components/data-table/src/data-table.model';
import { Unsubscriber } from 'techteec-lib/common';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, filter, of, switchMap } from 'rxjs';
import { MatDialog }  from '@angular/material/dialog';
import { KpiExtraFieldFormComponent } from '../kpi-extra-field-form/kpi-extra-field-form.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'amr-kpi-extra-field-list',
  standalone: true,
  imports: [CommonModule, MatGridListModule, DataTableComponent, MatProgressSpinnerModule],
  templateUrl: './kpi-Extra-Field-list.component.html',
  styleUrl: './kpi-Extra-Field-list.component.scss'
})
export class KpiExtraFieldListComponent extends Unsubscriber {
  private kpiExtraFieldService = inject(KpiExtraFieldService);
  loadingList$ = this.kpiExtraFieldService.loadingList$;
  loadingElement$ = this.kpiExtraFieldService.loadingElement$;
  columns = columns;
  filters = filters;
  btns = btns;
  data$ = new BehaviorSubject<CreateExtraFieldViewModel[]>([])
  dataSize = 0;
  latestFilter!: GeneralFilterModel;
  private dialog = inject(MatDialog);
  ///add other properties
  constructor() {
    super();
    this._otherSubscription = this.kpiExtraFieldService.getAll().subscribe(x => this.data$.next(x))
  }
  ///////////////////////
  btnClicked(btnIndex: number) {
    if(btnIndex == 0) {
      this._otherSubscription = this.dialog.open(KpiExtraFieldFormComponent, {panelClass: 'techteec-form-dialog'}).afterClosed().pipe(
        filter(bindingObject => bindingObject),
        switchMap(bindingObject => this.kpiExtraFieldService.addElement(bindingObject))
      ).subscribe(viewObject => this.data$.next([...this.data$.value,viewObject]))
    }
  }
  rowClicked(element: any) {
    console.log(element)
    this._otherSubscription = this.dialog.open(KpiExtraFieldFormComponent, {panelClass: 'techteec-form-dialog', data: element}).afterClosed().pipe(
      filter(bindingObject => bindingObject),
      switchMap(bindingObject => this.kpiExtraFieldService.editElement(bindingObject))
    ).subscribe(viewObject => {
      const i = this.data$.value.findIndex(x => x.id === element.id);
      this.data$.value[i] = viewObject
      this.data$.next(this.data$.value);
    })
  }
}
