import { Component, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { ReportBuilderComponent } from "../report-builder/report-builder.component";
import { CommonModule } from '@angular/common';
import { ReportSideListComponent } from "../report-side-list/report-side-list.component";
import { ReportDataTableComponent } from "../report-data-table/report-data-table.component";
import { toSignal } from '@angular/core/rxjs-interop';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ReportService } from '../report.service';
import { ConfirmService } from 'techteec-lib/dialogs-and-templates';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReportViewModel } from '../report';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-report-preview-list',
    standalone: true,
    templateUrl: './report-preview-list.component.html',
    styleUrl: './report-preview-list.component.scss',
    imports: [CommonModule, MatSidenavModule, MatTabsModule,
      ReportBuilderComponent, ReportSideListComponent,
      ReportDataTableComponent, MatListModule, MatIconModule, RouterLink, MatCardModule,MatProgressSpinnerModule, MatButtonModule]
})
export class ReportPreviewListComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private reportService = inject(ReportService);
  private confirm = inject(ConfirmService);
  report!: ReportViewModel | undefined;
  loadingDelete = toSignal(this.reportService.loadingDelete$, {initialValue: false});
  deletedReportIds: number[] = [];
  reportId = toSignal(this.route.queryParamMap.pipe(
    map((qParamMap: ParamMap) => +qParamMap.get('reportId')!)
  ), {initialValue: undefined})
  changeQueryParam(reportId?: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {reportId},
      queryParamsHandling: 'merge',
      replaceUrl: false,
    })
  }
  delete() {
    this.confirm.open({Title: 'Delete Report', Message: 'Are you sure you want to delete this report?', MatColor:'warn'}).pipe(
      filter(result => result),
      switchMap(() => this.reportService.deleteReport(this.reportId()!,0))
    ).subscribe(x => {
      if(x) {
        this.deletedReportIds.push(this.reportId()!);
        this.changeQueryParam();
      }
      
    })
  }
  setReport(report: ReportViewModel | undefined) {
    this.report = report;
  }
}
