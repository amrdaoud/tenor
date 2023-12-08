import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, finalize } from 'rxjs';
import { GeneralFilterModel } from 'techteec-lib/components/data-table/src/data-table.model';
import { DataWithSize } from '../common/generic';
import { SubsetListViewModel } from './subset';

@Injectable({
  providedIn: 'root'
})
export class SubsetService {

  constructor() { }
  private url = environment.apiUrl + 'subsets/';
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

  //Requests
  getByFilter(filter: GeneralFilterModel): Observable<DataWithSize<SubsetListViewModel>> {
    this.loadingList.next(true);
    return this.http.post<DataWithSize<SubsetListViewModel>>(this.url + 'getByFilter/', filter).pipe(
      finalize(() => this.loadingList.next(false))
    )
  }
}
