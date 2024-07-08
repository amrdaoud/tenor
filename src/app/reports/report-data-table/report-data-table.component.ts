import { AfterViewInit, Component, DestroyRef, computed, effect, inject, input, model, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { FILTER_ICON } from 'techteec-lib/common';
import { toSignal, toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReportService } from '../report.service';
import { filter, map, of, switchMap } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { ReportFilterControlComponent } from "../report-filter-control/report-filter-control.component";
import { ReportBuilderService } from '../report-builder/report-builder.service';
import { FormArray, FormGroup } from '@angular/forms';
import { enLogicalOperator } from '../../common/generic';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { saveAs } from "file-saver";
@Component({
  selector: 'app-report-data-table',
  standalone: true,
  templateUrl: './report-data-table.component.html',
  styleUrl: './report-data-table.component.scss',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatSortModule, MatMenuModule,
    ReportFilterControlComponent, MatButtonModule, MatSidenavModule, MatPaginatorModule, DatePipe, DecimalPipe,
    MatProgressSpinnerModule]
})
export class ReportDataTableComponent implements AfterViewInit {

  private reportService = inject(ReportService);
  private reportBuilder = inject(ReportBuilderService);
  private destroyRef = inject(DestroyRef);
  loadingRehearsal = toSignal(this.reportService.loadingRehearsal$, { initialValue: false });
  loadingData = toSignal(this.reportService.loadingData$, { initialValue: false });
  loadingDownload = toSignal(this.reportService.loadingDownload$, { initialValue: false });
  get enLogicalOperator(): typeof enLogicalOperator {
    return enLogicalOperator;
  }
  reportId = input.required<number>();
  data = signal<any[]>([]);
  dataSize = 0;
  pageIndex = input(0);
  pageSize = input(30);
  paginator = viewChild.required(MatPaginator);

  rehearsalData = toSignal(toObservable(this.reportId).pipe(
    filter(reportId => reportId !== undefined),
    switchMap(reportId => this.reportService.getReportRehearsal(reportId!)),
    takeUntilDestroyed(this.destroyRef)
  ));
  name = computed(() => this.rehearsalData()?.name);
  columnNames = computed(() => this.rehearsalData()?.columns.map(x => x.name));
  filterContainers = computed(() => this.rehearsalData()?.containerOfFilters);
  filterContainersFormArray = computed(() => this.reportBuilder.createContainerOfFilterFormArray(this.filterContainers()!));
  formArrayControls = computed(() => this.filterContainersFormArray().controls as FormGroup[]);
  dataSource = new MatTableDataSource<any>([]);
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIconLiteral('filter-icon', sanitizer.bypassSecurityTrustHtml(FILTER_ICON));
    effect(() => {
      this.dataSource.data = [];
      this.dataSize = 0;
    })
  }
  ngAfterViewInit(): void {
    this.dataSource.data = [];
    this.dataSize = 0;
    this.paginator().page.pipe(
      switchMap(page => this.reportService.getReportData(this.reportId(), page.pageSize, page.pageIndex, this.filterContainersFormArray().getRawValue())),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(x => {
      this.dataSize = x.dataSize;
      this.dataSource.data = x.data;
    }
    );

  }
  getFilterControls(i: number): FormGroup[] {
    return (this.formArrayControls()[i].get('reportFilters') as FormArray).controls as FormGroup[];
  }
  submit() {
    this.paginator().pageIndex = 0;
    this.reportService.getReportData(this.reportId(), this.paginator().pageSize, this.paginator().pageIndex, this.filterContainersFormArray().getRawValue()).pipe(
      takeUntilDestroyed(this.destroyRef)
    )
      .subscribe(x => {
        this.dataSize = x.dataSize;
        this.dataSource.data = x.data;
      });
  }
  download() {
    this.reportService.downloadReportById(this.reportId(), this.filterContainersFormArray().getRawValue()).subscribe(
      data => saveAs(data, this.rehearsalData()?.name + '-' + new Date().toLocaleDateString() + '.csv')
    )
  }
}
