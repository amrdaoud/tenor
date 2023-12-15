import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, finalize, of } from 'rxjs';
import { GeneralFilterModel } from 'techteec-lib/components/data-table/src/data-table.model';
import { CounterListViewModel,  CounterViewModel, CounterBindingModel} from './counter';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExtraField } from '../common/generic';

@Injectable({
  providedIn: 'root'
})
export class CounterService {

  constructor() { }
  private url = environment.apiUrl + 'counters';
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
  createForm(model?: CounterViewModel): FormGroup {
    return new FormGroup({
      id: new FormControl(model?.id ?? 0, Validators.required),
      name: new FormControl(model?.name, Validators.required),
      extraProperty: new FormControl(model?.extraProperty)
    })
  }
  //Requests
  getByFilter(filter: GeneralFilterModel): Observable<{data: CounterListViewModel[], dataSize: number}> {
    this.loadingList.next(true);
    return this.http.post<{data: CounterListViewModel[], dataSize: number}>(this.url + '/getByFilter', filter).pipe(
      finalize(() => this.loadingList.next(false))
    )
  }
  getById(id: number): Observable<CounterViewModel> {
    this.loadingElement.next(true);
    return this.http.get<CounterViewModel>(this.url + '/getById' + `?id=${id}`).pipe(
      finalize(() => this.loadingElement.next(false))
    )
  }
  addElement(model: CounterBindingModel): Observable<CounterViewModel> {
    this.loadingAddElement.next(true);
    return this.http.post<CounterViewModel>(this.url + '/addCounter', model).pipe(
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
