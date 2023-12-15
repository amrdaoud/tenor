import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { CounterSideListComponent } from '../../counters/counter-side-list/counter-side-list.component';
import { KpiSideListComponent } from '../kpi-side-list/kpi-side-list.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'

@Component({
  selector: 'app-kpi-builder',
  standalone: true,
  imports: [MatGridListModule, CounterSideListComponent, KpiSideListComponent, MatCardModule, MatFormFieldModule, MatInputModule],
  templateUrl: './kpi-builder.component.html',
  styleUrl: './kpi-builder.component.scss'
})
export class KpiBuilderComponent {

}
