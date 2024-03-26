import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, finalize, map, of } from 'rxjs';
import { GeneralFilterModel } from 'techteec-lib/components/data-table/src/data-table.model';
import {
  KpiFilterModel,
  KpiListViewModel, KpiViewModel
} from './kpi';
import { ExtraField, ResultWithMessage } from '../common/generic'
import { CreateKpi } from './kpi';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
@Injectable({
  providedIn: 'root',
})
export class KpiService {
  
  private url = environment.apiUrl + 'kpis';
  private http = inject(HttpClient);

  //Loaders
  private loadingList = new BehaviorSubject<boolean>(false);
  get loadingList$(): Observable<boolean> {
    return this.loadingList.asObservable();
  }
  private loadingElement = new BehaviorSubject<boolean>(false);
  get loadingElement$(): Observable<boolean> {
    return this.loadingElement.asObservable();
  }
  private loadingAddElement = new BehaviorSubject<boolean>(false);
  get loadingAddElement$(): Observable<boolean> {
    return this.loadingAddElement.asObservable();
  }
  private loadingMenuElements = new BehaviorSubject<number[]>([]);
  get loadingMenuElements$(): Observable<number[]> {
    return this.loadingMenuElements.asObservable();
  }
  public loadingDownload = new BehaviorSubject<boolean>(false);
  get loadingDownload$(): Observable<boolean> {
    return this.loadingDownload.asObservable();
  }
  private loadingExtraFields = new BehaviorSubject<boolean>(false);
  get loadingExtraFields$(): Observable<boolean> {
    return this.loadingExtraFields.asObservable();
  }
  private loadingValidate = new BehaviorSubject<boolean>(false);
  get loadingValidate$(): Observable<boolean> {
    return this.loadingValidate.asObservable();
  }
  private loadingCheckName = new BehaviorSubject<boolean>(false);
  get loadingCheckName$(): Observable<boolean> {
    return this.loadingCheckName.asObservable();
  }
  private loadingAdd = new BehaviorSubject<boolean>(false);
  get loadingAdd$(): Observable<boolean> {
    return this.loadingAdd.asObservable();
  }
  private loadingValue = new BehaviorSubject<boolean>(false);
  get loadingValue$(): Observable<boolean> {
    return this.loadingValue.asObservable();
  }
  getByFilter(
    filter: GeneralFilterModel
  ): Observable<{ data: KpiListViewModel[]; dataSize: number }> {
    this.loadingList.next(true);
    return this.http
      .post<{ data: KpiListViewModel[]; dataSize: number }>(
        this.url + '/getByFilter',
        filter
      )
      .pipe(finalize(() => this.loadingList.next(false)));
  }
  getById(id: number): Observable<KpiViewModel> {
    this.loadingElement.next(true);
    return this.http
      .get<KpiViewModel>(this.url + '/getById' + `?id=${id}`)
      .pipe(finalize(() => this.loadingElement.next(false)));
  }
  downloadByFilter(filter: GeneralFilterModel): Observable<any> {
    this.loadingDownload.next(true);
    return this.http
      .post(this.url + '/exportByFilter', filter, {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        responseType: 'blob',
      })
      .pipe(finalize(() => this.loadingDownload.next(false)));
  }
  getExtraFields(): Observable<ExtraField[]> {
    this.loadingExtraFields.next(true);
    return this.http
      .get<ExtraField[]>(this.url + '/GetExtraFields')
      .pipe(finalize(() => this.loadingExtraFields.next(false)));
  }
  validateKpi(model: CreateKpi): Observable<ResultWithMessage> {
    this.loadingValidate.next(true);
    return this.http.post<ResultWithMessage>(this.url + '/CheckFormatValidation', model).pipe(
      finalize(() => this.loadingValidate.next(false))
    )
  }
  validateName(deviceId: number, current?: string): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if(current?.toString()?.toLowerCase() === control.value.toString().toLowerCase()) {
        return of(null);
      }
      this.loadingCheckName.next(true);
      return this.http.get<boolean>(this.url + `/ValidateKpi?kpiName=${control.value}&deviceId=${deviceId}`).pipe(
        map(res => res ? null : {isTaken: true}),
        catchError(() => of(null)),
        finalize(() => this.loadingCheckName.next(false))
      );
    }
  }
  submitKpi(kpi: CreateKpi): Observable<KpiViewModel> {
    this.loadingAdd.next(true);
    return this.http.post<KpiViewModel>(this.url + '/add', kpi).pipe(
      finalize(() => this.loadingAdd.next(false))
    )
  }
  editKpi(kpi: CreateKpi): Observable<KpiViewModel> {
    this.loadingAdd.next(true);
    return this.http.put<KpiViewModel>(this.url + '/edit?id='+kpi.id, kpi).pipe(
      finalize(() => this.loadingAdd.next(false))
    )
  }
  deleteKpi(id: number, index: number): Observable<boolean> {
    this.loadingMenuElements.next([...this.loadingMenuElements.value, index]);
    return this.http.delete<boolean>(this.url + '/delete?id='+id).pipe(
      finalize(() => {
        const i = this.loadingMenuElements.value.findIndex(x => x === index);
        this.loadingMenuElements.value.splice(i, 1);
        this.loadingMenuElements.next(this.loadingMenuElements.value);
      })
    )
  }
  getData(kpiId:number, index: number): Observable<{data: string}> {
    this.loadingMenuElements.next([...this.loadingMenuElements.value, index]);
    return this.http.get<{data: string}>(environment.apiUrl + `oracle/GetKpiValue?kpiid=${kpiId}`).pipe(
      finalize(() => {
        const i = this.loadingMenuElements.value.findIndex(x => x === index);
        this.loadingMenuElements.value.splice(i, 1);
        this.loadingMenuElements.next(this.loadingMenuElements.value);
      })
    )
  }
  getQuery(kpiId:number, index: number): Observable<{query: string}> {
    this.loadingMenuElements.next([...this.loadingMenuElements.value, index]);
    return this.http.get<{query: string}>(environment.apiUrl + `kpis/GetKpiQueryByAmro?kpiid=${kpiId}`).pipe(
      finalize(() => {
        const i = this.loadingMenuElements.value.findIndex(x => x === index);
        this.loadingMenuElements.value.splice(i, 1);
        this.loadingMenuElements.next(this.loadingMenuElements.value);
      })
    )
  }
  
  

  

  
  

  

  
}
