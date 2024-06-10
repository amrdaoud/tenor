import { Component, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map } from 'rxjs';
import { ReportBuilderComponent } from "../report-builder/report-builder.component";
import { CommonModule } from '@angular/common';
import { ReportSideListComponent } from "../report-side-list/report-side-list.component";

@Component({
    selector: 'app-report-preview-list',
    standalone: true,
    templateUrl: './report-preview-list.component.html',
    styleUrl: './report-preview-list.component.scss',
    imports: [CommonModule, MatSidenavModule, MatTabsModule, ReportBuilderComponent, ReportSideListComponent]
})
export class ReportPreviewListComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  reportId$ = this.route.queryParamMap.pipe(
    map((qParamMap: ParamMap) => +qParamMap.get('reportId')!)
  )
  changeQueryParam(reportId: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {reportId},
      queryParamsHandling: 'merge',
      replaceUrl: false
    })
  }
}
