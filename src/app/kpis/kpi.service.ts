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
      .get<ExtraField[]>(this.url + '/GetExtraFields')
      .pipe(finalize(() => this.loadingExtraFields.next(false)));
  }

  //Aya && Alaa
  initObject() {
    /* var init = new KpiModel();
    init.type = 'KPI';
    init.id;
    init.name = 'root';
    init.parent = 0;
    init.order = 1;*/
    /*
    var child = new KpiModel();
    child.type = 0;
    child.id = ++this.index;
    child.name = '()';
    child.order = 1;
    child.childs = [];
    child.parent = init.id;*/
    /*
    this.currentParent.push(child.id);
    this.orderList[this.currentParent[this.currentParent.length - 1]] = 0;
    this.initList.push(init);
    this.initList.push(child);*/
  }
  tt = new Array<KpiModel>();
  j = 0;

  submit(extraField: any, name: any) {
    // this.formateKpi;
    let kpiFields = new Array<any>();
    /*console.log({id: value: extraField.code })*/

    this.i = 0;
    this.parent = 0;
    console.log(this.kpiResult);
    this.formateKpi();
    let kpiInit = new KpiModelInit();
    if (extraField != null) {
      for (const key of Object.keys(extraField))
        kpiFields.push({ id: 0, fieldId: key, value: extraField[key] });
    }
    console.log('kpiFields ..', kpiFields);
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
    console.log(this.kpiResult);
    console.log(kpiInit);
    console.log(JSON.stringify(kpiInit));
    this.submitKPI(kpiInit).subscribe((x) => console.log(x));

    /*let tt = new KpiModel();
    this.buildKpi(this.kpiResult, tt);
    console.log(tt);*/

    /*console.log(this.kpiResult);
    // this.formateKpi();
    console.log('----------------------------', this.kpiResult);
    let kpiInit = new KpiModelInit();
    kpiInit.id = 0;
    kpiInit.name = 'kpi' + Math.floor((1 + Math.random()) * 0x10000);
    var child = new KpiModel();
    // child.id = 0;
    child.name = '()';
    child.type = 0;
    child.order = 1;
    child.parent = 0;
    child.childs = this.BuildKpi();
    kpiInit.operation = child;
    this.i = 0;
    console.log(this.kpiResult);
    console.log(kpiInit);
    console.log(JSON.stringify(kpiInit));
    this.submitKPI(kpiInit).subscribe((x) => console.log(x));

    return kpiInit;*/
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

  /*buildKpi(items: any[], parentOperation: KpiModel) {
    let order = 1;
    for (var i = 0; i < items.length; i++) {
      if ([0, 1, 2, 6, 7].includes(items[i].type)) {
        parentOperation.childs.push({
          aggregation: 0,
          counterId: items[i].type === 1 ? items[i].id : 0,
          kpiId: items[i].type === 0 ? items[i].id : 0,
          operatorId: items[i].type === 2 ? items[i].id : 0,
          childs: [],
          functionId: 0,
          value: items[i].name,
          name: items[i].name,
          order: order,
          id: null,
          type: 0,
          parent: 0,
        });
      } else if (items[i].name === '(') {
        const currentVoidFunction: KpiModel = {
          type: 0,
          childs: [],
          order: order,
          id: null,
          name: '',
          value: undefined,
          parent: 0,
          aggregation: 0,
          counterId: 0,
          operatorId: 0,
          functionId: 0,
          kpiId: 0,
        };
        this.buildKpi(
          items.slice(i + 1, i + this.indexOfClosingBrace(items.slice(i))),
          currentVoidFunction
        );
        parentOperation.childs.push(currentVoidFunction);
        i = i + this.indexOfClosingBrace(items.slice(i));
      } else if (items[i].type === 5) {
        const closingBraceIndex = i + this.indexOfClosingBrace(items.slice(i));
        const currentFunction: KpiModel = {
          type: 0,
          childs: [],
          order: order,
          id: null,
          name: items[i].name,
          value: undefined,
          parent: 0,
          aggregation: 0,
          counterId: 0,
          operatorId: 0,
          functionId: 0,
          kpiId: 0,
        };
        parentOperation.childs.push(currentFunction);
        const currentVoidFunction: KpiModel = {
          type: 0,
          childs: [],
          order: order,
          id: null,
          name: '(',
          value: undefined,
          parent: 0,
          aggregation: 0,
          counterId: 0,
          operatorId: 0,
          functionId: 0,
          kpiId: 0,
        };
        parentOperation.childs.push(currentVoidFunction);

        const currentClosedVoidFunction: KpiModel = {
          type: 0,
          childs: [],
          order: order,
          id: null,
          name: ')',
          value: undefined,
          parent: 0,
          aggregation: 0,
          counterId: 0,
          operatorId: 0,
          functionId: 0,
          kpiId: 0,
        };
        let index = items.findIndex((x) => x.name == ',');
        items.splice(index - 1, 0, currentClosedVoidFunction);

        items.splice(index + 2, 0, currentVoidFunction);
        parentOperation.childs.push(currentVoidFunction);

        items.splice(closingBraceIndex + 3, 0, currentClosedVoidFunction);
      }
      order++;
    }
    console.log(parentOperation);
  }*/

  formateKpi() {
    for (; this.counter < this.kpiResult.length; this.counter++) {
      if (this.kpiResult[this.counter].type == 1) {
        this.counter++;
        this.findFunction();
      }
    }
  }
  remove(item: KpiModel): void {
    const index = this.kpiResult.indexOf(item);

    if (index >= 0) {
      this.kpiResult.splice(index, 1);

      // this.announcer.announce(`Removed ${fruit}`);
    }
  }
  /* indexOfClosingBrace(items: any[]): number {
    const arr: string[] = [];
    let index = 0;
    for (var i = 0; i < items.length; i++) {
      if (items[i].name === ')') {
        arr.pop();
      } else if (items[i].name === '(') {
        arr.push('(');
      }
      if (arr.length === 0) {
        index = i;
        return i;
      }
    }
    return index;
  } */

  findFunction() {
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
        this.findFunction();
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
  /* formateKpi() {
    for (let i = 0; i < this.kpiResult.length; i++) {
      if (this.kpiResult[i].type == 5) {
        console.log("****")
        let id = this.kpiResult[i + 1].id;
         console.log('****');
        let idx = i;
        this.kpiResult.splice(idx + 2, 0, {
          id: id,
          name: '(',
          argumentsCount: null,
          isBool: false,
          operations: null,
          type: 3,
        });
       for (let j = idx + 3; j < this.kpiResult.length; j++) {
          if (this.kpiResult[j].id == id && this.kpiResult[j].name == ')') {
            this.kpiResult.splice(j - 1, 0, {
              id: id,
              name: ')',
              argumentsCount: null,
              isBool: false,
              operations: null,
              type: 3,
            });
          }

         /* if (this.kpiResult[j].id === id && this.kpiResult[j].name == ',') {
            this.kpiResult.splice(
              j - 1,
              0,
              {
                id: id,
                name: ')',
                argumentsCount: null,
                isBool: false,
                operations: null,
                type: 3,
              },
              {
                id: id,
                name: '(',
                argumentsCount: null,
                isBool: false,
                operations: null,
                type: 3,
              }
            );
          }*/
  /* }
      }
    }
  }*/

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

  submitKPI(filter: KpiModelInit): Observable<any> {
    this.loadingDownload.next(true);
    return this.http
      .post(this.url + '/add', filter, {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        responseType: 'blob',
      })
      .pipe(finalize(() => this.loadingDownload.next(false)));
  }

  /*handleElement(currentEvent: any, type: any) {
    if (currentEvent.name == ')') {
      this.currentParent.pop();
    }

    if (currentEvent.name != ')' && currentEvent.name != ',') {
      var init = new KpiModel();
      init = currentEvent;
      init.type = currentEvent.Type;

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
      if (
        currentEvent.name == '(' &&
        this.initList[this.initList.length - 1].type == 'Void Function'
      )
        ++this.index;
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
  }*/

  addNumber(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.kpiResult.push({ name: value, type: 5 });
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
  dblclick(item: any) {
    this.kpiResult.push(item);
    let i = Math.floor((1 + Math.random()) * 0x10000);
    if (item.type == 1) {
      this.kpiResult.push(
        {
          id: i,
          name: '(',
          argumentsCount: null,
          isBool: false,
          operations: null,
          type: 4,
        },
        {
          name: ',',
          argumentsCount: null,
          isBool: false,
          operations: null,
          type: 3,
        },
        {
          id: i,
          name: ')',
          argumentsCount: null,
          isBool: false,
          operations: null,
          type: 4,
        }
      );
    }
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
      console.log('********************************************');
      let i = Math.floor((1 + Math.random()) * 0x10000);
      if (this.kpiResult[event.currentIndex].type == 1) {
        this.kpiResult.splice(
          event.currentIndex + 1,
          0,
          {
            id: i,
            name: '(',
            argumentsCount: null,
            isBool: false,
            operations: null,
            type: 4,
          },
          {
            name: ',',
            argumentsCount: null,
            isBool: false,
            operations: null,
            type: 3,
          },
          {
            id: i,
            name: ')',
            argumentsCount: null,
            isBool: false,
            operations: null,
            type: 4,
          }
        );
      }
    }
  }
}
