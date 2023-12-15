import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, finalize } from 'rxjs';
import { GeneralFilterModel } from 'techteec-lib/components/data-table/src/data-table.model';
import { KpiListViewModel,  KpiViewModel, KpiBindingModel} from './kpi';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExtraField } from '../common/generic';

@Injectable({
  providedIn: 'root'
})
export class KpiService {

  constructor() { }
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
  private loadingDownload = new BehaviorSubject<boolean>(false);
  get loadingDownload$(): Observable<boolean> {
    return this.loadingDownload.asObservable();
  }
  private loadingExtraFields = new BehaviorSubject<boolean>(false);
  get loadingExtraFields$(): Observable<boolean> {
    return this.loadingExtraFields.asObservable();
  }
  
  //Creating Form
  createForm(model?: KpiViewModel): FormGroup {
    return new FormGroup({
      id: new FormControl(model?.id ?? 0, Validators.required),
      name: new FormControl(model?.name, Validators.required),
      extraProperty: new FormControl(model?.extraProperty)
    })
  }

  //Requests
  getByFilter(filter: GeneralFilterModel): Observable<{data: KpiListViewModel[], dataSize: number}> {
    this.loadingList.next(true);
    return this.http.post<{data: KpiListViewModel[], dataSize: number}>(this.url + '/getByFilter', filter).pipe(
      finalize(() => this.loadingList.next(false))
    )
  }
  getById(id: number): Observable<KpiViewModel> {
    this.loadingElement.next(true);
    return this.http.get<KpiViewModel>(this.url + '/Get' + `?id=${id}`).pipe(
      finalize(() => this.loadingElement.next(false))
    )
  }
  addElement(model: KpiBindingModel): Observable<KpiViewModel> {
    this.loadingAddElement.next(true);
    return this.http.post<KpiViewModel>(this.url + '', model).pipe(
      finalize(() => this.loadingAddElement.next(false))
    )
  }
  downloadByFilter(filter: GeneralFilterModel): Observable<any> {
    this.loadingDownload.next(true);
    return this.http.post(this.url + '/exportByFilter', filter, {headers: new HttpHeaders().set('Content-Type', 'application/json'), responseType: 'blob'}).pipe(
      finalize(() => this.loadingDownload.next(false))
    )
  }
  getExtraFields(): Observable<ExtraField[]> {
    this.loadingExtraFields.next(true);
    return this.http.get<ExtraField[]>(this.url + '/getExtraFields').pipe(
      finalize(() => this.loadingExtraFields.next(false))
    )
  }
}
