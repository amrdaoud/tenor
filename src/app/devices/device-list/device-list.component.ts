import { Component, inject } from '@angular/core';
import { DeviceService } from '../device.service';
import { btns, columns, filters } from '../device.const';
import { DeviceListViewModel } from '../device';
import { MatGridListModule } from '@angular/material/grid-list';
import { DataTableComponent } from 'techteec-lib/components/data-table';
import { GeneralFilterModel } from 'techteec-lib/components/data-table/src/data-table.model';
import { Unsubscriber } from 'techteec-lib/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'amr-device-list',
  standalone: true,
  imports: [CommonModule, MatGridListModule, DataTableComponent],
  templateUrl: './device-list.component.html',
  styleUrl: './device-list.component.scss'
})
export class DeviceListComponent extends Unsubscriber {
  private deviceService = inject(DeviceService);
  loadingList$ = this.deviceService.loadingList$;
  columns = columns;
  filters = filters;
  btns = btns;
  data: DeviceListViewModel[] = [];
  dataSize = 0;
  changed(filter: GeneralFilterModel) {
    this._otherSubscription = this.deviceService.getByFilter(filter).subscribe(x => {
      this.data = x.data;
      this.dataSize = x.dataSize;
    })
  }
  buttonCliked(event: any) {
  }
}
