import { Injectable, inject } from '@angular/core';
import { OperationModel, FunctionModel } from './operator';
import { BehaviorSubject, Observable, concatMap, finalize, map, mergeMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TreeNodeViewModel } from '../common/generic';

@Injectable({
  providedIn: 'root',
})
export class OperatorsService {
  private url = environment.apiUrl + 'kpis';
  private http = inject(HttpClient);
  private loadingOperators = new BehaviorSubject<boolean>(false);
  get loadingOperators$(): Observable<boolean> {
    return this.loadingOperators.asObservable();
  }
  private loadingFunctions = new BehaviorSubject<boolean>(false);
  get loadingFunctions$(): Observable<boolean> {
    return this.loadingFunctions.asObservable();
  }
  private loadingOperatorsAndFunctions = new BehaviorSubject<boolean>(false);
  get loadingOperatorsAndFunctions$(): Observable<boolean> {
    return this.loadingOperatorsAndFunctions.asObservable();
  }
  constructor() {}
  getOperators(): Observable<TreeNodeViewModel[]> {
    this.loadingOperators.next(true);
    return this.http.get<OperationModel[]>(this.url + '/GetOperators').pipe(
      map(operators => operators.map(operator => {
        const node: TreeNodeViewModel = {
          id: operator.id,
          name: operator.name!,
          children: [],
          hasChild: false,
          type: 'operator'
        }
        return node;
      })),
      finalize(() => this.loadingOperators.next(false))
    )
  }
  getFunctions(): Observable<TreeNodeViewModel[]> {
    this.loadingFunctions.next(true)
    return this.http.get<FunctionModel[]>(this.url + '/GetFunctions').pipe(
      map(functions => functions.map(fn => {
        const node: TreeNodeViewModel = {
          id: fn.id,
          name: fn.name!,
          children: [],
          hasChild: false,
          type: 'function'
        }
        return node;
      })),
      finalize(() => this.loadingFunctions.next(false))
    )
  }
  getOperatorsAndFunctions(): Observable<TreeNodeViewModel[]> {
    this.loadingOperatorsAndFunctions.next(true);
    return this.getOperators().pipe(
      concatMap(x => this.getFunctions().pipe(
        map(y => x.concat(y))
      )),
      finalize(() => this.loadingOperatorsAndFunctions.next(false))
    )
  }
}
