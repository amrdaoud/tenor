import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, finalize } from 'rxjs';
import { GeneralFilterModel } from 'techteec-lib/components/data-table/src/data-table.model';
import { KpiListViewModel,  KpiViewModel, KpiBindingModel, KpiModel, KpiModelInit} from './kpi';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExtraField } from '../common/generic';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import {
  CdkDragDrop,
  copyArrayItem,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
@Injectable({
  providedIn: 'root',
})
export class KpiService {
  constructor() {}
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
  private loadingDownload = new BehaviorSubject<boolean>(false);
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
      .get<ExtraField[]>(this.url + '/getExtraFields')
      .pipe(finalize(() => this.loadingExtraFields.next(false)));
  }

  //Aya && Alaa
  initObject() {
    var init = new KpiModel();
    init.type = 'KPI';
    init.id;
    init.name = 'root';
    init.parent = 0;
    init.order = 1;

    var child = new KpiModel();
    child.type = 'Void Function';
    child.id = ++this.index;
    child.name = '()';
    child.order = 1;
    child.childs = [];
    child.parent = init.id;

    this.currentParent.push(child.id);
    this.orderList[this.currentParent[this.currentParent.length - 1]] = 0;
    this.initList.push(init);
    this.initList.push(child);
  }

  submit() {
    this.initList = [];
    this.initObject();
    this.kpiResult.forEach((element: any, ind: number) => {
      console.log(element);
      this.handleElement(element, element.type);
    });
    this.KpiAlgorithm();
  }
  getType(selected: number) {
    var type =
      selected == 0
        ? 'KPI'
        : selected == 1
        ? 'Counter'
        : selected == 2
        ? 'Operation'
        : selected == 3
        ? 'Void Function'
        : selected == 5
        ? 'Function'
        : selected == 6
        ? 'Parameter'
        : 'Number';
    return type;
  }

  KpiAlgorithm() {
    var resultedList = this.initList;
    resultedList.forEach((Childs: any) => {
      resultedList.forEach((Childs_: any) => {
        if (Childs.id == Childs_.parent) Childs.childs.push(Childs_);
      });
    });
    var init = new KpiModelInit();
    init.name = 'KPI';
    init.id = 0;
    init.operation = resultedList[0];
    this.arrayResult = [init][0];
    console.log([init][0]);
    // this.placeKPI(this.arrayResult).subscribe();
  }
  handleElement(currentEvent: any, type: any) {
    if (currentEvent.name == ')') {
      this.currentParent.pop();
    }

    if (currentEvent.name != ')' && currentEvent.name != ',') {
      var init = new KpiModel();
      init = currentEvent;

      init.type = this.getType(type);

      init.id = ++this.index;
      init.order = ++this.orderList[
        this.currentParent[this.currentParent.length - 1]
      ];
      init.parent = this.currentParent[this.currentParent.length - 1];
      init.childs = [];
      this.initList.push(init);
    }
    if (currentEvent.name == '(' || type == 5) {
      this.currentParent.push(this.index);
      this.orderList[this.currentParent[this.currentParent.length - 1]] = 0;
    }
    if (
      currentEvent.name == '(' &&
      this.initList[this.initList.length - 2].type == 'Function'
    ) {
      this.initList[this.initList.length - 2].type = 'Function';

      // this.initList.pop();
    }
    if (currentEvent.name == ',') {
      var item1 = {
        id: 101,
        name: ')',
        argumentsCount: null,
        isBool: false,
        operations: null,
        type: 3,
      };
      var item2 = {
        id: 100,
        name: '(',
        argumentsCount: null,
        isBool: false,
        operations: null,
        type: 3,
      };
      this.handleElement(item1, 3);
      this.handleElement(item2, 3);
    }
    this.initList.forEach((Childs) => {
      Childs.childs = [];
    });
  }

  addNumber(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.kpiResult.push({ name: value, type: 7 });
    }
    event.chipInput!.clear();
  }
  editNumber(item: KpiModel, event: MatChipEditedEvent) {
    const value = event.value.trim();
    if (!value) {
      this.removeNumber(item);
      return;
    }
    const index = this.kpiResult.indexOf(item);
    if (index >= 0) {
      this.kpiResult[index].name = value;
    }
  }
  removeNumber(item: KpiModel): void {
    const index = this.kpiResult.indexOf(item);
    if (index >= 0) {
      this.kpiResult.splice(index, 1);
    }
  }
  drop(event: CdkDragDrop<string[]>) {
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
