import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, finalize, map } from 'rxjs';
import { GeneralFilterModel } from 'techteec-lib/components/data-table/src/data-table.model';
import { DataWithSize } from '../common/generic';
import {
  SubsetBindingModel,
  SubsetListViewModel,
  SubsetViewModel,
} from './subset';

@Injectable({
  providedIn: 'root',
})
export class SubsetService {
  constructor() {}
  private url = environment.apiUrl + 'subsets';
  http = inject(HttpClient);

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

  //Requests
  getByFilter(filter: any): Observable<DataWithSize<SubsetListViewModel>> {
    this.loadingList.next(true);
    return this.http
      .post<DataWithSize<SubsetListViewModel>>(
        this.url + '/getByFilter/',
        filter
      )
      .pipe(finalize(() => this.loadingList.next(false)));
  }
  getBySearchQuery(searchQuery: string): Observable<SubsetListViewModel[]> {
    let filter = {
      PageIfilterndex: 0,
      PageSize: 10,
      SortActive: 'name',
      SortDirection: 'asc',
      SearchQuery: searchQuery,
    };
    this.loadingList.next(true);
    return this.http
      .post<DataWithSize<SubsetListViewModel>>(
        this.url + '/getByFilter/',
        filter
      )
      .pipe(
        map((x) => x.data),
        finalize(() => this.loadingList.next(false))
      );
  }

  getById(id: number): Observable<SubsetViewModel> {
    this.loadingElement.next(true);
    return this.http
      .get<SubsetViewModel>(this.url + `?id=${id}`)
      .pipe(finalize(() => this.loadingElement.next(false)));
  }
  addElement(model: SubsetBindingModel): Observable<SubsetViewModel> {
    this.loadingAddElement.next(true);
    return this.http
      .post<SubsetViewModel>(this.url + '', model)
      .pipe(finalize(() => this.loadingAddElement.next(false)));
  }
  downloadByFilter(filter: GeneralFilterModel): Observable<any> {
    this.loadingDownload.next(true);
    return this.http
      .post(this.url + '/filter/export', filter, {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        responseType: 'blob',
      })
      .pipe(finalize(() => this.loadingDownload.next(false)));
  }
}
