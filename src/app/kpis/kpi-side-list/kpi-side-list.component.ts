import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  tap,
  switchMap,
  startWith,
  distinctUntilChanged,
  debounceTime,
} from 'rxjs';
import { Unsubscriber } from 'techteec-lib/common';
import { InputComponent, SelectComponent } from 'techteec-lib/controls';
import { ExtraField } from '../../common/generic';
import { KpiListViewModel } from '../kpi';
import { KpiService } from '../kpi.service';
import { CdkDragMove, DragDropModule } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-kpi-side-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatListModule,
    InputComponent,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatDividerModule,
    MatMenuModule,
    SelectComponent,
    DragDropModule,
  ],
  templateUrl: './kpi-side-list.component.html',
  styleUrl: './kpi-side-list.component.scss',
})
export class KpiSideListComponent extends Unsubscriber {
  @Input() deviceId: any;
  public kpiService = inject(KpiService);
  loadingList$ = this.kpiService.loadingList$;
  frm = new FormGroup<any>({
    searchQuery: new FormControl(''),
    pageIndex: new FormControl(0),
    pageSize: new FormControl(20),
    sortActive: new FormControl('name'),
    sortDirection: new FormControl('asc'),
  });
  itemList: any = [];
  listSize = 0;
  extraFields: ExtraField[] = [];
  constructor() {
    super();
    this._otherSubscription = this.kpiService
      .getExtraFields()
      .pipe(
        tap((extraFields: ExtraField[]) => {
          extraFields.forEach((field) => {
            this.frm.addControl(field.name, new FormControl());
          });
        }),
        tap((extraFields: ExtraField[]) => (this.extraFields = extraFields)),
        switchMap(() => this.frm.valueChanges),
        startWith(this.frm.value),
        distinctUntilChanged(),
        debounceTime(400),
        tap(() => this.frm.get('pageIndex')?.setValue(0, { emitEvent: false })),
        switchMap(() =>
          this.kpiService.getByFilter({
            ...this.frm.value,
            deviceId: this.deviceId,
          })
        )
      )
      .subscribe((c) => {
        this.itemList = c.data.map((x) => ({ ...x, type: 2 }));
        this.listSize = c.dataSize;
      });
  }
  loadMore() {
    this.frm
      .get('pageIndex')
      ?.setValue(+this.frm.get('pageIndex')?.value + 1, { emitEvent: false });
    this._otherSubscription = this.kpiService
      .getByFilter(this.frm.value)
      .subscribe((c) => this.itemList.push(...c.data));
  }
  onScroll(event: any) {
    if (
      event.target.offsetHeight + event.target.scrollTop >=
      event.target.scrollHeight
    ) {
      if (this.listSize > this.itemList.length) {
        this.loadMore();
      }
    }
  }
  offset: any = null;

  setStyle(event: MouseEvent) {}
  public onDragMove(event: any): void {}
}
