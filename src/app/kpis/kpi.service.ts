import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, finalize, map } from 'rxjs';
import { GeneralFilterModel } from 'techteec-lib/components/data-table/src/data-table.model';
import {
  KpiListViewModel,
  KpiViewModel,
  KpiBindingModel,
  KpiModel,
  KpiModelInit,
} from './kpi';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExtraField } from '../common/generic';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import {
  CdkDragDrop,
  copyArrayItem,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root',
})
export class KpiService {
  constructor(private snakBar: MatSnackBar) {}
  private url = environment.apiUrl + 'kpis';
  private http = inject(HttpClient);

  kpiResult = new Array<any>();
  initList = new Array<KpiModel>();
  currentParent = new Array<number>();
  orderList = new Array<number>();
  arrayResult!: any;
  index = 0;
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
  public loadingDownload = new BehaviorSubject<boolean>(false);
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
      extraProperty: new FormControl(model?.extraProperty),
    });
  }

  //Requests
  getByFilter(
    filter: GeneralFilterModel
  ): Observable<{ data: KpiListViewModel[]; dataSize: number }> {
    this.loadingList.next(true);
    return this.http
      .post<{ data: KpiListViewModel[]; dataSize: number }>(
        this.url + '/getByFilter',
        filter
      )
      .pipe(finalize(() => this.loadingList.next(false)));
  }
  getById(id: number): Observable<KpiViewModel> {
    this.loadingElement.next(true);
    return this.http
      .get<KpiViewModel>(this.url + '/Get' + `?id=${id}`)
      .pipe(finalize(() => this.loadingElement.next(false)));
  }
  addElement(model: KpiBindingModel): Observable<KpiViewModel> {
    this.loadingAddElement.next(true);
    return this.http
      .post<KpiViewModel>(this.url + '', model)
      .pipe(finalize(() => this.loadingAddElement.next(false)));
  }
  downloadByFilter(filter: GeneralFilterModel): Observable<any> {
    this.loadingDownload.next(true);
    return this.http
      .post(this.url + '/exportByFilter', filter, {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        responseType: 'blob',
      })
      .pipe(finalize(() => this.loadingDownload.next(false)));
  }
  getExtraFields(): Observable<ExtraField[]> {
    this.loadingExtraFields.next(true);
    return this.http
      .get<ExtraField[]>(this.url + '/GetExtraFields')
      .pipe(finalize(() => this.loadingExtraFields.next(false)));
  }
  CheckFormatValidation(filter: KpiModelInit): Observable<any> {
    this.loadingDownload.next(true);
    return this.http
      .post(this.url + '/CheckFormatValidation', filter, {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        responseType: 'blob',
      })
      .pipe(finalize(() => this.loadingDownload.next(false)));
  }
  //Aya && Alaa
  tt = new Array<KpiModel>();
  j = 0;
  initObject(extraField: any, name: any) {
    let kpiFields = new Array<any>();
    this.i = 0;
    this.parent = 0;
    this.formatKpi();
    let kpiInit = new KpiModelInit();
    if (extraField != null) {
      for (const key of Object.keys(extraField))
        kpiFields.push({ id: 0, fieldId: key, value: extraField[key] });
    }
    kpiInit.kpiFields = kpiFields;
    kpiInit.name = name;
    var child = new KpiModel();
    // child.id = 0;
    child.name = '(';
    child.type = 4;
    child.order = 1;
    child.parent = 0;
    child.childs = this.BuildKpi();
    kpiInit.operation = child;
    this.i = 0;
    console.log(kpiInit);
    return kpiInit;
  }

  submit(extraField: any, name: any) {
    this.submitCurrentKPI(this.initObject(extraField, name)).subscribe(
      (x) => {
        this.kpiResult = [];
        this.snakBar.open('kpi Submitted successfully', 'close');
      },
      (error: any) => {
        this.snakBar.open('error in submit KPI', 'close');
      }
    );
  }

  i: number = 0;
  counter: number = 0;
  parent = 0;
  test = new Array<any>();
  parentId = 0;

  BuildKpi() {
    let node = new Array<KpiModel>();
    let order = 0;
    let parentId = 0;
    for (; this.i < this.kpiResult.length; this.i++) {
      if (this.kpiResult[this.i].name == ')') {
        this.currentParent.pop();
        return node;
      }
      if (
        this.kpiResult[this.i].name == '(' ||
        this.kpiResult[this.i].type == 1
      ) {
        let kpi = new KpiModel();
        kpi.value = this.kpiResult[this.i].name;
        kpi.type = this.kpiResult[this.i].type;
        if (this.kpiResult[this.i].type == 1) {
          kpi.functionId = this.kpiResult[this.i].id;
          this.i++;
        }
        kpi.order = ++order;
        kpi.parent = this.parent;
        this.parent += 1;
        node.push(kpi);
        this.i++;
        node[node.length - 1].childs = this.BuildKpi();
      } else {
        /*if (this.kpiResult[this.i].name == ',') {
          this.i++;
        }*/
        let kpi = new KpiModel();
        kpi.name = this.kpiResult[this.i].name;
        kpi.order = ++order;
        kpi.type = this.kpiResult[this.i].type;
        kpi.value = this.kpiResult[this.i].name;
        kpi.parent = this.parent;
        if (this.kpiResult[this.i].type == 2) {
          kpi.kpiId = this.kpiResult[this.i].id;
        } else if (this.kpiResult[this.i].type == 0) {
          kpi.counterId = this.kpiResult[this.i].id;
          kpi.aggregation = 1;
        } else if (this.kpiResult[this.i].type == 3) {
          kpi.operatorId = this.kpiResult[this.i].id;
        }
        if (this.kpiResult[this.i].name != ',') node.push(kpi);
      }
    }
    return node;
  }

  formatKpi() {
    for (; this.counter < this.kpiResult.length; this.counter++) {
      if (this.kpiResult[this.counter].type == 1) {
        this.counter++;
        this.changeCycleOfFunction();
      }
    }
  }
  removeItem(item: KpiModel): void {
    const index = this.kpiResult.indexOf(item);
    if (index >= 0) {
      this.kpiResult.splice(index, 1);
    }
  }

  changeCycleOfFunction() {
    let k = 0;
    this.kpiResult.splice(this.counter + 1, 0, {
      id: 324,
      name: '(',
      argumentsCount: null,
      isBool: false,
      operations: null,
      type: 4,
    });
    this.counter += 2;
    k++;
    for (; this.counter < this.kpiResult.length; this.counter++) {
      if (this.kpiResult[this.counter].type == 1) {
        this.counter++;
        this.changeCycleOfFunction();
      }

      if (this.counter >= this.kpiResult.length && k == 1) {
        k--;
        this.kpiResult.splice(this.counter + 1, 0, {
          id: 324,
          name: ')',
          argumentsCount: null,
          isBool: false,
          operations: null,
          type: 4,
        });
        this.counter++;
      }
      if (this.counter >= this.kpiResult.length) return;

      if (this.kpiResult[this.counter].name == '(') k++;
      if (this.kpiResult[this.counter].name == ',') {
        this.kpiResult.splice(this.counter, 0, {
          id: 324,
          name: ')',
          argumentsCount: null,
          isBool: false,
          operations: null,
          type: 4,
        });
        this.counter = this.counter + 1;
        this.kpiResult.splice(this.counter + 1, 0, {
          id: 324,
          name: '(',
          argumentsCount: null,
          isBool: false,
          operations: null,
          type: 4,
        });

        this.counter = this.counter + 1;
      } else if (this.kpiResult[this.counter].name == ')') k--;
      if (k == 0) {
        this.kpiResult.splice(this.counter, 0, {
          id: 324,
          name: ')',
          argumentsCount: null,
          isBool: false,
          operations: null,
          type: 4,
        });
        this.counter + 1;
      }
    }
  }

  submitCurrentKPI(filter: KpiModelInit): Observable<any> {
    this.loadingDownload.next(true);
    return this.http
      .post(this.url + '/add', filter, {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        responseType: 'blob',
      })
      .pipe(finalize(() => this.loadingDownload.next(false)));
  }

  addNumber(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.kpiResult.push({ name: value, type: 5 });
    }
    event.chipInput!.clear();
  }

  dblclickOnItem(item: any) {
    this.kpiResult.push(item);
  }
  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
