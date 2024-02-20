import { Component, OnInit, inject } from '@angular/core';
import { DeviceService } from '../device.service';
import { btns, columns, filters } from '../device.const';
import { DeviceListViewModel } from '../device';
import { MatGridListModule } from '@angular/material/grid-list';
import { DataTableComponent } from 'techteec-lib/components/data-table';
import { MatButtonModule } from '@angular/material/button';
import {
  DataTableFilter,
  GeneralFilterModel,
} from 'techteec-lib/components/data-table/src/data-table.model';
import { Unsubscriber } from 'techteec-lib/common';
import { CommonModule } from '@angular/common';
import { filter, of, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DeviceFormComponent } from '../device-form/device-form.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-kpi-device',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    DataTableComponent,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatListModule,
  ],
  templateUrl: './kpi-device.component.html',
  styleUrl: './kpi-device.component.scss',
})
export class KpiDeviceComponent extends Unsubscriber implements OnInit {
  private deviceService = inject(DeviceService);
  loadingList$ = this.deviceService.loadingList$;
  loadingElement$ = this.deviceService.loadingElement$;
  columns = columns;
  filters = filters;
  btns = btns;
  Input: any;
  data: DeviceListViewModel[] = [];
  dataSize = 0;
  latestFilter!: GeneralFilterModel;
  ///add other properties
  frm = new FormGroup<any>({
    searchQuery: new FormControl(''),
    pageIndex: new FormControl(0),
    pageSize: new FormControl(3000),
    sortActive: new FormControl('name'),
    sortDirection: new FormControl('asc'),
  });
  tempData!: any[];
  dataSize_: any;
  searchControl = new FormControl('', { updateOn: 'change' });
  constructor(private route: Router) {
    super();
    this.searchControl.valueChanges.subscribe((x) =>
      this.getDevices(this.searchControl.value!)
    );
  }

  ngOnInit(): void {
    this.changed(this.frm.value);
  }

  changed(filter: GeneralFilterModel) {
    this._otherSubscription = this.deviceService
      .getByFilter(filter)
      .subscribe((x) => {
        this.data = x.data.filter((x: any) => x.parentId == null);
        this.tempData = this.data;
        console.log(this.data);
        this.dataSize = x.dataSize;
      });
  }

  gridClicked(event: any) {
    console.log(event);
    this.route.navigate(['kpis/builder', { deviceId: event.id }]);
  }

  getDevices(value: string) {
    var result = this.data.filter((x) => x.name.includes(value));
    if (value.length > 0) return (this.data = result);
    return (this.data = this.tempData);
  }
}
