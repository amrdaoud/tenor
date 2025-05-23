import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, delay, finalize, map, of } from 'rxjs';
import { ContainerOfFilter, CreateReport, ReportDto, ReportMeasureDto, ReportViewModel } from './report';
import { DataWithSize, ExtraField, TreeNodeViewModel } from '../common/generic';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { GeneralFilterModel } from 'techteec-lib/components/data-table/src/data-table.model';
import { ReportRehearsalModel } from './report-data-table/models/report-data-table';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private url = environment.apiUrl + 'report';
  private http = inject(HttpClient);
  
  private loadingLevels = new BehaviorSubject<boolean>(false);
  get loadingLevels$(): Observable<boolean> {
    return this.loadingLevels.asObservable();
  }

  private loadingFilters = new BehaviorSubject<boolean>(false);
  get loadingFilters$(): Observable<boolean> {
    return this.loadingFilters.asObservable();
  }

  private loadingFilterOptions = new BehaviorSubject<boolean>(false);
  get loadingFilterOptions$(): Observable<boolean> {
    return this.loadingFilterOptions.asObservable();
  }

  private loadingReport = new BehaviorSubject<boolean>(false);
  get loadingReport$(): Observable<boolean> {
    return this.loadingReport.asObservable();
  }

  private loadingExtraFields = new BehaviorSubject<boolean>(false);
  get loadingExtraFields$(): Observable<boolean> {
    return this.loadingReport.asObservable();
  }

  private loadingCheckName = new BehaviorSubject<boolean>(false);
  get loadingCheckName$(): Observable<boolean> {
    return this.loadingCheckName.asObservable();
  }
  private loadingAddReport = new BehaviorSubject<boolean>(false);
  get loadingAddReport$(): Observable<boolean> {
    return this.loadingAddReport.asObservable();
  }

  private loadingList = new BehaviorSubject<boolean>(false);
  get loadingList$(): Observable<boolean> {
    return this.loadingList.asObservable();
  }
  private loadingDelete = new BehaviorSubject<boolean>(false);
  get loadingDelete$(): Observable<boolean> {
    return this.loadingDelete.asObservable();
  }
  private loadingMenuElements = new BehaviorSubject<number[]>([]);
  get loadingMenuElements$(): Observable<number[]> {
    return this.loadingMenuElements.asObservable();
  }
  private loadingTreeUsers = new BehaviorSubject<boolean>(false);;
  get loadingTreeUsers$(): Observable<boolean> {
    return this.loadingTreeUsers.asObservable();
  }
  private loadingTreeDevices = new BehaviorSubject<boolean>(false);;
  get loadingTreeDevices$(): Observable<boolean> {
    return this.loadingTreeDevices.asObservable();
  }
  private loadingTreeReports = new BehaviorSubject<boolean>(false);;
  get loadingTreeReports$(): Observable<boolean> {
    return this.loadingTreeReports.asObservable();
  }
  private loadingRehearsal = new BehaviorSubject<boolean>(false);
  get loadingRehearsal$(): Observable<boolean> {
    return this.loadingRehearsal.asObservable();
  }
  private loadingData = new BehaviorSubject<boolean>(false);
  get loadingData$(): Observable<boolean> {
    return this.loadingData.asObservable();
  }
  private loadingDownload = new BehaviorSubject<boolean>(false);
  get loadingDownload$(): Observable<boolean> {
    return this.loadingDownload.asObservable();
  }
  getLevelsByMeasures(measures: ReportMeasureDto[]): Observable<TreeNodeViewModel[]> {
    this.loadingLevels.next(true);
    return this.http.post<TreeNodeViewModel[]>(this.url + '/getDimensionLevels', measures).pipe(
      finalize(() =>this.loadingLevels.next(false))
    )
  }
  getFiltersByMeasures(measures: ReportMeasureDto[]): Observable<TreeNodeViewModel[]> {
    this.loadingFilters.next(true);
    return this.http.post<TreeNodeViewModel[]>(this.url + '/getDimensionFilters', measures).pipe(
      finalize(() =>this.loadingFilters.next(false))
    )
  }
  getFilterOptions(levelId: number, searchQuery: string | null, pageIndex: number, pageSize: number): Observable<string[]> {
    this.loadingFilterOptions.next(true);
    let params = new HttpParams()
    .set('levelId', levelId)
    .set('pageIndex', pageIndex)
    .set('pageSize', pageSize);
    if(searchQuery) params = params.set('searchQuery', searchQuery);
    return this.http.get<string[]>(this.url + '/getFilterOptions', {params: params}).pipe(
      finalize(() => this.loadingFilterOptions.next(false))
    )
  }

  getById(id: number): Observable<ReportViewModel> {
    this.loadingReport.next(true);
    return this.http.get<ReportViewModel>(this.url + `/getById?id=${id}`).pipe(
      finalize(() => this.loadingReport.next(false))
    )
  }

  getExtraFields(deviceId?:number): Observable<ExtraField[]> {
    this.loadingExtraFields.next(true);
    let params = new HttpParams();
    if(deviceId) {
      params = params.set('deviceId', deviceId);
    }
    return this.http
      .get<ExtraField[]>(this.url + '/GetExtraFields', {params: params})
      .pipe(finalize(() => this.loadingExtraFields.next(false)));
  }
  validateName(deviceControlName: string, current?: string): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const matchWithControl = control.parent?.get(deviceControlName);
      if(!control || !matchWithControl || !control.value || !matchWithControl.value) {
        return of(null);
      }
      if(current?.toString()?.toLowerCase() === control.value.toString().toLowerCase()) {
        return of(null);
      }
      this.loadingCheckName.next(true);
      return this.http.get<boolean>(this.url + `/ValidateReport?reportName=${control.value}&deviceId=${matchWithControl.value}`).pipe(
        map(res => res ? null : {isTaken: true}),
        catchError(() => of(null)),
        finalize(() => this.loadingCheckName.next(false))
      );
    }
  }
  validateDevice(nameControlName: string, current?: number): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const matchWithControl = control.parent?.get(nameControlName);
      if(!control || !matchWithControl || !control.value || !matchWithControl.value) {
        return of(null);
      }
      if(current?.toString()?.toLowerCase() === control.value.toString().toLowerCase()) {
        return of(null);
      }
      this.loadingCheckName.next(true);
      return this.http.get<boolean>(this.url + `/ValidateReport?reportName=${matchWithControl.value}&deviceId=${control.value}`).pipe(
        map(res => res ? null : {isTaken: true}),
        catchError(() => of(null)),
        finalize(() => this.loadingCheckName.next(false))
      );
    }
  }
  validateDeviceAndName(currentName?: string, currentDeviceId?: number): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const nameCntrl = control.get('name');
      const deviceCntrl = control.get('deviceId');
      if(!nameCntrl || !deviceCntrl || !nameCntrl.value || !deviceCntrl.value) {
        return of(null);
      }
      if(nameCntrl.value === currentName && deviceCntrl.value === currentDeviceId) {
        return of(null);
      }
      this.loadingCheckName.next(true);
      return this.http.get<boolean>(this.url + `/ValidateReport?reportName=${nameCntrl.value}&deviceId=${deviceCntrl.value}`).pipe(
        map(res => res ? null : {isTaken: true}),
        catchError(() => of(null)),
        finalize(() => this.loadingCheckName.next(false))
      );
    }
  }
  addReport(report: CreateReport): Observable<ReportViewModel> {
    this.loadingAddReport.next(true);
    return this.http.post<ReportViewModel>(this.url + '/add', report).pipe(
      finalize(() => this.loadingAddReport.next(false))
    )
  }

  getByFilter(
    filter: GeneralFilterModel
  ): Observable<{ data: ReportDto[]; dataSize: number }> {
    this.loadingList.next(true);
    return this.http
      .post<{ data: ReportDto[]; dataSize: number }>(
        this.url + '/getByFilter',
        filter
      )
      .pipe(finalize(() => this.loadingList.next(false)));
  }
  deleteReport(id: number, index: number): Observable<boolean> {
    this.loadingMenuElements.next([...this.loadingMenuElements.value, index]);
    this.loadingDelete.next(true);
    return this.http.delete<boolean>(this.url + '/hardDelete?id='+id).pipe(
      finalize(() => {
        this.loadingDelete.next(false);
        const i = this.loadingMenuElements.value.findIndex(x => x === index);
        this.loadingMenuElements.value.splice(i, 1);
        this.loadingMenuElements.next(this.loadingMenuElements.value);
      })
    )
  }
  getReportTreeUserNames(filter: any): Observable<TreeNodeViewModel[]> {
    this.loadingTreeUsers.next(true);
    return this.http.post<TreeNodeViewModel[]>(this.url + '/GetReportTreeUserNames', filter).pipe(
      finalize(() => this.loadingTreeUsers.next(false))
    )
  }
  getReportTreeDevicesByUserName(filter: any): Observable<TreeNodeViewModel[]> {
    this.loadingTreeDevices.next(true);
    return this.http.post<TreeNodeViewModel[]>(this.url + '/GetReportTreeDevicesByUserName', filter).pipe(
      finalize(() => this.loadingTreeDevices.next(false))
    )
  }
  getReportTreeByUserNameDevice(filter: any): Observable<TreeNodeViewModel[]> {
    this.loadingTreeReports.next(true);
    return this.http.post<TreeNodeViewModel[]>(this.url + '/GetReportTreeByUserNameDevice', filter).pipe(
      finalize(() => this.loadingTreeReports.next(false))
    )
  }
  getReportTreeByUserName(filter: any): Observable<TreeNodeViewModel[]> {
    this.loadingTreeReports.next(true);
    return this.http.post<TreeNodeViewModel[]>(this.url + '/GetReportTreeByUserName', filter).pipe(
      finalize(() => this.loadingTreeReports.next(false))
    )
  }
  editReport(report: CreateReport): Observable<ReportViewModel> {
    this.loadingAddReport.next(true);
    return this.http.put<ReportViewModel>(this.url + '/edit?id='+report.id, report).pipe(
      finalize(() => this.loadingAddReport.next(false))
    )
  }
  getReportRehearsal(reportId: number): Observable<ReportRehearsalModel> {
    this.loadingRehearsal.next(true);
    return this.http.get<ReportRehearsalModel>(this.url + `/getRehearsal?id=${reportId}`).pipe(
      finalize(() => this.loadingRehearsal.next(false))
    );
  }
  getReportData(reportId: number, pageSize: number, pageIndex: number, filters: ContainerOfFilter[]): Observable<DataWithSize<any>> {
    this.loadingData.next(true);
    let params = new HttpParams()
    .set('reportId', reportId)
    .set('pageIndex', pageIndex)
    .set('pageSize', pageSize);
    return this.http.post<DataWithSize<any>>(this.url + '/getReportDataById', filters, {params}).pipe(
      finalize(() => this.loadingData.next(false))
    );
  } 
  downloadReportById(reportId: number, filters: ContainerOfFilter[]): Observable<Blob> {
    this.loadingDownload.next(true);
    let params = new HttpParams()
    .set('reportId', reportId);
    return this.http.post(this.url + '/exportReportDataById', filters, {params, responseType: 'blob'}).pipe(
      finalize(() => this.loadingDownload.next(false))
    )
  }
}
