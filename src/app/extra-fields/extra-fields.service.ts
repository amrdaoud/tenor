import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, finalize } from 'rxjs';
import { GeneralFilterModel } from 'techteec-lib/components/data-table/src/data-table.model';
import { ExtraFieldListViewModel,  ExtraFieldViewModel, ExtraFieldBindingModel} from './extra-fields';
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
  private loadingElementRow = new BehaviorSubject<number[]>([]);
  get loadingElementRow$(): Observable<number[]> {
    return this.loadingElementRow.asObservable();
  }
    //Creating Form
  createForm(model?: ExtraFieldViewModel): FormGroup {
    return new FormGroup({
      id: new FormControl(model?.id ?? 0, Validators.required),
      name: new FormControl(model?.name, Validators.required),
      type: new FormControl(model?.type, Validators.required),
      content: new FormControl(model?.content),
      isMandatory: new FormControl(model?.isMandatory ?? false, Validators.required),
      isForKpi: new FormControl(model?.isForKpi ?? false, Validators.required),
      isForReport: new FormControl(model?.isForReport ?? false, Validators.required),
      isForDashboard: new FormControl(model?.isForDashboard ?? false, Validators.required),
      deviceId: new FormControl(model?.deviceId, Validators.required)
    })
  }
  //Requests
  getByFilter(filter: GeneralFilterModel): Observable<{data: ExtraFieldListViewModel[], dataSize: number}> {
    this.loadingList.next(true);
    return this.http.post<{data: ExtraFieldListViewModel[], dataSize: number}>(this.url + '/GetAll', filter).pipe(
      finalize(() => this.loadingList.next(false))
    )
  }
  getById(id: number): Observable<ExtraFieldViewModel> {
    this.loadingElement.next(true);
    return this.http.get<ExtraFieldViewModel>(this.url + '/GetById' + `?id=${id}`).pipe(
      finalize(() => this.loadingElement.next(false))
    )
  }
  addElement(model: ExtraFieldBindingModel): Observable<ExtraFieldViewModel> {
    this.loadingAddElement.next(true);
    return this.http.post<ExtraFieldViewModel>(this.url + '/add', model).pipe(
      finalize(() => this.loadingAddElement.next(false))
    )
  }
  editElement(model: ExtraFieldBindingModel, index: number): Observable<ExtraFieldViewModel> {
    this.loadingElementRow.next([...this.loadingElementRow.value, index]);
    return this.http.put<ExtraFieldViewModel>(this.url + `/edit?id=${model.id}`, model).pipe(
      finalize(() => {
        this.loadingElementRow.value.splice(this.loadingElementRow.value.indexOf(index));
        this.loadingElementRow.next(this.loadingElementRow.value);
      })
    )
  }
  deleteElement(id: number, index: number): Observable<boolean> {
    this.loadingElementRow.next([...this.loadingElementRow.value, index]);
    return this.http.delete<boolean>(this.url + '/delete' + `?id=${id}`).pipe(
      finalize(() => {
        this.loadingElementRow.value.splice(this.loadingElementRow.value.indexOf(index));
        this.loadingElementRow.next(this.loadingElementRow.value);
      })
    )
  }
  downloadByFilter(filter: GeneralFilterModel): Observable<any> {
    this.loadingDownload.next(true);
    return this.http.post(this.url + '/export', filter, {headers: new HttpHeaders().set('Content-Type', 'application/json'), responseType: 'blob'}).pipe(
      finalize(() => this.loadingDownload.next(false))
    )
  }
}
