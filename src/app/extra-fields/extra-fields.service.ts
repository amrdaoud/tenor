import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, finalize } from 'rxjs';
import { GeneralFilterModel } from 'techteec-lib/components/data-table/src/data-table.model';
import { ExtraFieldsListViewModel,  ExtraFieldsViewModel, ExtraFieldsBindingModel} from './extra-fields';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ExtraFieldsService {

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
  createForm(model?: ExtraFieldsViewModel): FormGroup {
    return new FormGroup({
      id: new FormControl(model?.id ?? 0, Validators.required),
      name: new FormControl(model?.name, Validators.required),
      extraProperty: new FormControl(model?.extraProperty)
    })
  }
  //Requests
  getByFilter(filter: GeneralFilterModel): Observable<{data: ExtraFieldsListViewModel[], dataSize: number}> {
    this.loadingList.next(true);
    return this.http.post<{data: ExtraFieldsListViewModel[], dataSize: number}>(this.url + '/GetAll', filter).pipe(
      finalize(() => this.loadingList.next(false))
    )
  }
  getById(id: number): Observable<ExtraFieldsViewModel> {
    this.loadingElement.next(true);
    return this.http.get<ExtraFieldsViewModel>(this.url + '/GetById' + `?id=${id}`).pipe(
      finalize(() => this.loadingElement.next(false))
    )
  }
  addElement(model: ExtraFieldsBindingModel): Observable<ExtraFieldsViewModel> {
    this.loadingAddElement.next(true);
    return this.http.post<ExtraFieldsViewModel>(this.url + '/add', model).pipe(
      finalize(() => this.loadingAddElement.next(false))
    )
  }
  editElement(model: ExtraFieldsBindingModel): Observable<ExtraFieldsViewModel> {
    this.loadingAddElement.next(true);
    return this.http.put<ExtraFieldsViewModel>(this.url + '/edit', model).pipe(
      finalize(() => this.loadingAddElement.next(false))
    )
  }
  deleteElement(id: number): Observable<boolean> {
    this.loadingAddElement.next(true);
    return this.http.delete<boolean>(this.url + '/delete' + `?id=${id}`).pipe(
      finalize(() => this.loadingAddElement.next(false))
    )
  }
  downloadByFilter(filter: GeneralFilterModel): Observable<any> {
    this.loadingDownload.next(true);
    return this.http.post(this.url + '/export', filter, {headers: new HttpHeaders().set('Content-Type', 'application/json'), responseType: 'blob'}).pipe(
      finalize(() => this.loadingDownload.next(false))
    )
  }
}
