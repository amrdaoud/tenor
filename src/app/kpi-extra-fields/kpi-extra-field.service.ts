import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, finalize } from 'rxjs';
import { GeneralFilterModel } from 'techteec-lib/components/data-table/src/data-table.model';
import { KpiExtraFieldListViewModel,  KpiExtraFieldViewModel, KpiExtraFieldBindingModel, CreateExtraFieldViewModel} from './kpi-extra-field';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fieldTypes } from '../common/generic';

@Injectable({
  providedIn: 'root'
})
export class KpiExtraFieldService {

  constructor() { }
  private url = environment.apiUrl + 'extrafields';
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
    //Creating Form
  createForm(model?: CreateExtraFieldViewModel): FormGroup {
    return new FormGroup({
      id: new FormControl(model?.id ?? 0, Validators.required),
      name: new FormControl(model?.name, Validators.required),
      type: new FormControl<fieldTypes | undefined>(model?.type, Validators.required),
      content: new FormControl(model?.content)
    })
  }
  //Requests
  getAll(): Observable<CreateExtraFieldViewModel[]> {
    this.loadingList.next(true);
    return this.http.get<CreateExtraFieldViewModel[]>(this.url + '/getall').pipe(
      finalize(() => this.loadingList.next(false))
    )
  }
  addElement(model: CreateExtraFieldViewModel): Observable<CreateExtraFieldViewModel> {
    this.loadingAddElement.next(true);
    return this.http.post<CreateExtraFieldViewModel>(this.url + '/add', model).pipe(
      finalize(() => this.loadingAddElement.next(false))
    )
  }
  editElement(model: CreateExtraFieldViewModel): Observable<CreateExtraFieldViewModel> {
    this.loadingAddElement.next(true);
    return this.http.put<CreateExtraFieldViewModel>(this.url + '/edit', model).pipe(
      finalize(() => this.loadingAddElement.next(false))
    )
  }
  deleteElement(id: number): Observable<boolean> {
    this.loadingAddElement.next(true);
    return this.http.delete<boolean>(this.url + '/delete' + `?id=${id}`).pipe(
      finalize(() => this.loadingAddElement.next(false))
    )
  }
}
