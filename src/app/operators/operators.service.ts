import { Injectable, inject } from '@angular/core';
import { OperationModel, FunctionModel } from './operator';
import { BehaviorSubject, Observable, finalize } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OperatorsService {
  private url = environment.apiUrl + 'kpis';
  private http = inject(HttpClient);
  constructor() {}
  getOperations(): Observable<OperationModel[]> {
    return this.http.get<OperationModel[]>(this.url + '/GetOperators');
  }
  getFunctions(): Observable<FunctionModel[]> {
    return this.http.get<FunctionModel[]>(this.url + '/GetFunctions');
  }
}
