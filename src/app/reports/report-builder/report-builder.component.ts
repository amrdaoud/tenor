import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { CounterSideTreeComponent } from '../../counters/counter-side-tree/counter-side-tree.component';
import { KpiSideListComponent } from '../../kpis/kpi-side-list/kpi-side-list.component';
import { Observable, delay, filter, map, of, pipe, switchMap, tap } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { ReportBuilderService } from './report-builder.service';
import { CreateReport, ReportMeasureDto, ReportViewModel } from '../report';
import { ReportMeasuresComponent } from "../report-measures/report-measures.component";
import { CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray } from '@angular/cdk/drag-drop';
import { TreeNodeViewModel } from '../../common/generic';
import { MatButtonModule } from '@angular/material/button';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReportFiltersComponent } from "../report-filters/report-filters.component";
import { SharedFormControlsComponent } from '../../shared/shared-form-controls/shared-form-controls.component';
import { Unsubscriber } from 'techteec-lib/common';
import { ReportLevelsComponent } from "../report-levels/report-levels.component";
import { ReportService } from '../report.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ComponentCanDeactivate } from '../../app-core/guards/unsaved.guard';

@Component({
    selector: 'app-report-builder',
    standalone: true,
    templateUrl: './report-builder.component.html',
    styleUrl: './report-builder.component.scss',
    imports: [CommonModule, MatStepperModule,
        CounterSideTreeComponent, KpiSideListComponent, MatListModule, MatIconModule, ReportMeasuresComponent, CdkDropListGroup, CdkDropList, MatButtonModule, SharedFormControlsComponent,
        ReactiveFormsModule, ReportFiltersComponent, ReportLevelsComponent, MatProgressSpinnerModule]
})
export class ReportBuilderComponent extends Unsubscriber implements OnInit, OnChanges, ComponentCanDeactivate {
  
  canDeactivate(): boolean | Observable<boolean> {
    return this.frm.pristine || this.submitted ? true : false;
  };
  @Input() reportId!: number | null;
  submitted: boolean = false;
  measuresdropContainers: CdkDropList<any>[] = [];
  private reportBuilderService = inject(ReportBuilderService);
  private reportService = inject(ReportService);
  private router = inject(Router);
  loadingReport$ = this.reportService.loadingReport$;
  loadingAddReport$ = this.reportService.loadingAddReport$
  viewMeasures = [];
  report!: ReportViewModel;
  private route = inject(ActivatedRoute);
  frm!: FormGroup;
  isClone = false;
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['reportId'] && this.reportId) {
      this._otherSubscription = this.reportService.getById(this.reportId).pipe(
        tap((report: ReportViewModel) => this.report = report),
        switchMap(e => this.reportService.getExtraFields(e.deviceId!)),
        map((e) => this.reportBuilderService.createReportForm(this.report,e)),
        tap(x => {
          this.frm = x;
          this.frm.markAsPristine();
          this.frm.disable();
        })
      ).subscribe();
    }
  }
  ngOnInit(): void {
    this.isClone = this.router.url.includes('/clone/');
    if(!this.reportId) {
      this._otherSubscription = this.route.paramMap.pipe(
        switchMap((param: ParamMap) => {
          if(+param.get('reportId')!) {
            return this.reportService.getById(+param.get('reportId')!).pipe(
              tap((report: ReportViewModel) => this.report = report),
              switchMap(e => this.reportService.getExtraFields(e.deviceId!)),
              map(e => this.reportBuilderService.createReportForm(this.report,e, this.isClone)),
            )
          } else {
            return of(this.reportBuilderService.createReportForm())
          }
        }),
        tap(x => {
          this.frm = x;
          this.frm.markAsPristine();
          
        }),
        switchMap(x => this.frm?.get('deviceId')?.valueChanges!),
        switchMap(e => this.reportService.getExtraFields(e)),
        tap(e => {this.reportBuilderService.resetExtraFields(this.frm,e,this.report)}),
      ).subscribe()
    }
  }
  get measures(): FormArray {
    return this.frm.get('measures') as FormArray;
  }
  get filterContainers(): FormArray {
    return this.frm.get('containerOfFilters') as FormArray;
  }
  get levels(): FormArray {
    return this.frm.get('levels') as FormArray;
  }
  submit() {
    if(this.frm.invalid) {
      return;
    }
    if(this.report && !this.isClone) {
      this._otherSubscription = this.reportService.editReport(this.frm.value).subscribe(x => {
        if(x) {
          this.submitted = true;
          this.router.navigate([`/reports/preview-list`], {queryParams:{reportId: x.id}})
        }
      });
      return;
    }
    this._otherSubscription = this.reportService.addReport(this.frm.value).subscribe(x => {
      if(x) {
        this.submitted = true;
        this.router.navigate([`/reports/preview-list`], {queryParams:{reportId: x.id}})
      }
    });
  }
  
}
