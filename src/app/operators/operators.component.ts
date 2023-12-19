import { Unsubscriber } from 'techteec-lib/common';
import { OperatorsService } from './operators.service';
import { Component, inject } from '@angular/core';
import { FunctionModel, OperationModel } from './operator';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import {

  MatChipsModule,

} from '@angular/material/chips';
import {
  DragDropModule,

} from '@angular/cdk/drag-drop';
import { KpiService } from './../kpis/kpi.service';
@Component({
  selector: 'app-operators',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatChipsModule, DragDropModule],

  templateUrl: './operators.component.html',
  styleUrl: './operators.component.scss',
})
export class OperatorsComponent extends Unsubscriber {
  operationList: any = [];
  functionList: any = [];
  public kpiService = inject(KpiService);

  operationService = inject(OperatorsService);
  constructor() {
    super();
    this._otherSubscription = this.operationService
      .getOperations()
      .subscribe((c) => {
        this.operationList = c.map((x) => ({ ...x, type: 2 }));
      });
    this._otherSubscription = this.operationService
      .getFunctions()
      .subscribe((c) => {
        this.functionList = c;
        this.functionList = c.map((x) => ({ ...x, type: 5 }));
        this.functionList.push({
          id: 100,
          name: '(',
          argumentsCount: null,
          isBool: false,
          operations: null,
          type: 3,
        });
        this.functionList.push({
          id: 101,
          name: ')',
          argumentsCount: null,
          isBool: false,
          operations: null,
          type: 3,
        });
        this.functionList.push({
          id: 102,
          name: ',',
          argumentsCount: null,
          isBool: false,
          operations: null,
          type: 6,
        });
      });
  }
}
