import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, finalize } from 'rxjs';
import { ReportMeasureDto } from './report';
import { TreeNodeViewModel } from '../common/generic';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private url = environment.apiUrl + 'report';
  private http = inject(HttpClient);
  
  private loadingLevels = new BehaviorSubject<boolean>(false);
  get loadingLevels$(): Observable<boolean> {
    return this.loadingLevels.asObservable();
  }

  private loadingFilters = new BehaviorSubject<boolean>(false);
  get loadingFilters$(): Observable<boolean> {
    return this.loadingFilters.asObservable();
  }

  getLevelsByMeasures(measures: ReportMeasureDto[]): Observable<TreeNodeViewModel[]> {
    this.loadingLevels.next(true);
    return this.http.post<TreeNodeViewModel[]>(this.url + '/getDimensionLevels', measures).pipe(
      finalize(() =>this.loadingLevels.next(false))
    )
  }
  getFiltersByMeasures(measures: ReportMeasureDto[]): Observable<TreeNodeViewModel[]> {
    this.loadingFilters.next(true);
    return this.http.post<TreeNodeViewModel[]>(this.url + '/getDimensionLevels', measures).pipe(
      finalize(() =>this.loadingFilters.next(false))
    )
  }

}
