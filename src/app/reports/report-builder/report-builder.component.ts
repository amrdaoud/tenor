import { Component, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { CounterSideTreeComponent } from '../../counters/counter-side-tree/counter-side-tree.component';
import { KpiSideListComponent } from '../../kpis/kpi-side-list/kpi-side-list.component';
import { Observable, filter, of, pipe } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { ReportBuilderService } from './report-builder.service';
import { CreateReport, ReportMeasureDto } from '../report';
import { ReportMeasuresComponent } from "../report-measures/report-measures.component";
import { CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray } from '@angular/cdk/drag-drop';
import { TreeNodeViewModel } from '../../common/generic';
import { MatButtonModule } from '@angular/material/button';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { ReportFiltersComponent } from "../report-filters/report-filters.component";
import { SharedFormControlsComponent } from '../../shared/shared-form-controls/shared-form-controls.component';
import { Unsubscriber } from 'techteec-lib/common';

@Component({
    selector: 'app-report-builder',
    standalone: true,
    templateUrl: './report-builder.component.html',
    styleUrl: './report-builder.component.scss',
    imports: [CommonModule, MatStepperModule,
        CounterSideTreeComponent, KpiSideListComponent, MatListModule, MatIconModule, ReportMeasuresComponent, CdkDropListGroup, CdkDropList, MatButtonModule, SharedFormControlsComponent,
        ReactiveFormsModule, ReportFiltersComponent]
})
export class ReportBuilderComponent {
  measuresdropContainers: CdkDropList<any>[] = [];
  private reportBuilderService = inject(ReportBuilderService);
  viewMeasures = [];
  report!: CreateReport;
  frm = this.reportBuilderService.createReportForm(20,[]);
  // constructor() {
  //   this.measures.valueChanges.subscribe(x => console.log(x));
  // }
  get measures(): FormArray {
    return this.frm.get('measures') as FormArray;
  }
  get filterContainers(): FormArray {
    return this.frm.get('containerOfFilters') as FormArray;
  }
  
}
