import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { Unsubscriber } from 'techteec-lib/common';
import { CounterService } from '../counter.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CounterListViewModel } from '../counter';
import { ExtraField } from '../../common/generic';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatList, MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  AutoCompleteComponent,
  InputComponent,
  SelectComponent,
  SelectWithSearchComponent,
} from 'techteec-lib/controls';
import { SubsetService } from '../../subsets/subset.service';
import { SubsetListViewModel } from '../../subsets/subset';
import { DeviceService } from '../../devices/device.service';
import { DeviceListViewModel } from '../../devices/device';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { KpiService } from '../../kpis/kpi.service';
@Component({
  selector: 'app-counter-side-list',
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
    AutoCompleteComponent,
    SelectWithSearchComponent,
    DragDropModule,
  ],
  templateUrl: './counter-side-list.component.html',
  styleUrl: './counter-side-list.component.scss',
})
export class CounterSideListComponent extends Unsubscriber {
  private counterService = inject(CounterService);
  private subsetService = inject(SubsetService);
  private deviceService = inject(DeviceService);
  public kpiService = inject(KpiService);

  loadingList$ = this.counterService.loadingList$;
  frm = new FormGroup<any>({
    searchQuery: new FormControl(''),
    pageIndex: new FormControl(0),
    pageSize: new FormControl(20),
    sortActive: new FormControl('name'),
    sortDirection: new FormControl('asc'),
    subsetId: new FormControl<string>(''),
    deviceId: new FormControl(0),
  });
  itemList: any = [];
  listSize = 0;
  extraFields: ExtraField[] = [];
  subsets: SubsetListViewModel[] = [];
  devices: DeviceListViewModel[] = [];
  constructor() {
    super();
    this._otherSubscription = this.counterService
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
          this.counterService.getByFilter({
            ...this.frm.value,
            deviceId: this.frm.value.deviceId.toString(),
          })
        )
      )
      .subscribe((c) => {
        this.itemList = c.data.map((x) => ({ ...x, type: 0 }));
        this.listSize = c.dataSize;
      });
  }
  loadMore() {
    this.frm
      .get('pageIndex')
      ?.setValue(+this.frm.get('pageIndex')?.value + 1, { emitEvent: false });
    this._otherSubscription = this.counterService
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
  subsetSearchChanged(searchQuery: string | null) {
    this._otherSubscription = this.subsetService
      .getByFilter({
        PageIndex: 0,
        SortActive: 'name',
        PageSize: 10,
        SortDirection: 'asc',
        SearchQuery: searchQuery,
      })
      .subscribe((x) => (this.subsets = x.data));
  }
  deviceSearchChanged(searchQuery: string | null) {
    this._otherSubscription = this.deviceService
      .getByFilter({
        PageIndex: 0,
        SortActive: 'name',
        PageSize: 10,
        SortDirection: 'asc',
        SearchQuery: searchQuery,
      } as any)
      .subscribe((x) => (this.devices = x.data));
  }
}
