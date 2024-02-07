import { Component, inject } from '@angular/core';
import { DeviceService } from '../device.service';
import { btns, columns, filters } from '../device.const';
import { DeviceListViewModel } from '../device';
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
import { DeviceFormComponent } from '../device-form/device-form.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { routes } from '../../app.routes';
import { Router } from '@angular/router';

@Component({
  selector: 'amr-device-list',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    DataTableComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './device-list.component.html',
  styleUrl: './device-list.component.scss',
})
export class DeviceListComponent extends Unsubscriber {
  private deviceService = inject(DeviceService);
  loadingList$ = this.deviceService.loadingList$;
  loadingElement$ = this.deviceService.loadingElement$;
  columns = columns;
  filters = filters;
  btns = btns;
  data: DeviceListViewModel[] = [];
  dataSize = 0;
  latestFilter!: GeneralFilterModel;
  private dialog = inject(MatDialog);
  ///add other properties

  ///////////////////////
  constructor(private route: Router) {
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
    this._otherSubscription = this.deviceService
      .getByFilter(filter)
      .subscribe((x) => {
        this.data = x.data;
        this.dataSize = x.dataSize;
      });
  }
  btnClicked(btnIndex: number) {
    if (btnIndex == 0) {
      this._otherSubscription = this.dialog
        .open(DeviceFormComponent, { panelClass: 'techteec-form-dialog' })
        .afterClosed()
        .pipe(
          filter((bindingObject) => bindingObject),
          switchMap((bindingObject) =>
            this.deviceService.addElement(bindingObject)
          )
        )
        .subscribe((viewObject) => this.changed(this.latestFilter));
    }
  }
  rowClicked(event: any) {
    console.log(event);
    this.route.navigate(['kpis/builder', { deviceId: event.id }]);
    /*  this._otherSubscription = this.deviceService
      .getById(element.id)
      .pipe(
        switchMap((viewObject) =>
          this.dialog
            .open(DeviceFormComponent, {
              panelClass: 'techteec-form-dialog',
              data: viewObject,
            })
            .afterClosed()
        ),
        filter((bindingObject) => bindingObject),
        switchMap((bindingObject) =>
          this.deviceService.editElement(bindingObject)
        )
      )
      .subscribe((viewObject) => this.changed(this.latestFilter)); */
  }
}
