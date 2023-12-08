import { Component, inject } from '@angular/core';
import { DataTableComponent } from 'techteec-lib/components/data-table';
import { MatGridListModule} from '@angular/material/grid-list';
@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [MatGridListModule, DataTableComponent],
  templateUrl: './device-list.component.html',
  styleUrl: './device-list.component.scss'
})
export class DeviceListComponent {

}
