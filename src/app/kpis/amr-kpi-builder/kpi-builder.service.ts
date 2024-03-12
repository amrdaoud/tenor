import { Injectable, inject } from '@angular/core';
import { OperationBinding } from '../kpi';
import { ExtraField, TreeNodeViewModel, enAggregation, enOPerationTypes } from '../../common/generic';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { KpiViewModel, OperationDto } from '../kpi';
import { KpiService } from '../kpi.service';

@Injectable({
  providedIn: 'root'
})
export class KpiBuilderService {
  private kpiService = inject(KpiService);
  createKpiForm(deviceId:number, extraFields: ExtraField[],kpi?: KpiViewModel): FormGroup {
    let frm = new FormGroup({
      id: new FormControl(kpi?.id ?? 0, Validators.required),
      name: new FormControl(kpi?.name, {
        validators: Validators.required,
        asyncValidators: this.kpiService.validateName(deviceId, kpi?.name),
        updateOn: 'blur'
        }),
      deviceId: new FormControl(kpi?.deviceId, Validators.required),
      isPublic: new FormControl(kpi?.isPublic ?? false, Validators.required),
      kpiFields: new FormArray([]),
      operation: new FormControl(kpi?.operations, Validators.required)
    });
    extraFields.forEach(ef => {
      (frm.get('kpiFields') as FormArray).push(new FormGroup({
        id: new FormControl(0),
        name: new FormControl(ef.name),
        fieldId: new FormControl(ef.id),
        type: new FormControl(ef.type),
        content: new FormControl(ef.content),
        value: new FormControl(kpi?.extraFields?.find(x => x.fieldId === ef.id)?.value, {validators: ef.isMandatory ? Validators.required : null} )
      }))
    })
    return frm;
  }
  buildKpiOperationChilds(items: TreeNodeViewModel[]): OperationBinding[] {
    const operations: OperationBinding[] = [];
    let childOrder = 0;
    let i = 0;
    while(i < items.length) {
      switch(items[i].type) {
        case('operator'): {
          if(items[i].name === ')') {
            i++;
            break;
          }
          else if(items[i].name === '(') {
            const closing = this.bracketIndexOfClosing(items.slice(i));
            if(!closing) {
              throw new Error('Cannot find closing brace');
            }
            const voidFunctionOperation: OperationBinding = {
              id: 0,
              order: childOrder,
              type: enOPerationTypes.voidFunction,
              childs: this.buildKpiOperationChilds(items.slice(i+1,i + closing))
            }
            operations.push(voidFunctionOperation);
            i = closing;
            break;
          }
          else {
            operations.push(this.buildRegularOperation(items[i],childOrder));
          }
          i++;
          break;
        }
        case('function'): {
          const closing = this.functionIndexOfClosing(items.slice(i));
          if(!closing) {
            throw new Error(`Please check function: "${items[i].name}" braces`);
          }
          const chunks = this.splitByComma(items.slice(i, i + closing + 1));
          const childs: OperationBinding[] = [];
          chunks.forEach((chunk, idx) => {
            childs.push({
              id: 0,
              type: enOPerationTypes.voidFunction,
              order: idx,
              childs: this.buildKpiOperationChilds(chunk)
            })
          });
          operations.push({
            id: 0,
            type: enOPerationTypes.function,
            functionId: items[i].id,
            order: childOrder,
            childs: childs
          });
          i = i + closing;
          break;
        }

        default :{
          operations.push(this.buildRegularOperation(items[i], childOrder));
          childOrder++;
          i++;
          break;
        }
      }
    }
    return operations;
  }
  buildRegularOperation(item: TreeNodeViewModel, order: number): OperationBinding {
    return {
      id: 0,
      order: order,
      aggregation: this.itemToAggregationType(item.aggregation!),
      counterId: this.itemToOperationType(item.type) === enOPerationTypes.counter ? item.id : null,
      kpiId: this.itemToOperationType(item.type) === enOPerationTypes.kpi ? item.id : null,
      operatorId: this.itemToOperationType(item.type) === enOPerationTypes.opt ? item.id : null,
      type: this.itemToOperationType(item.type),
      value: item.name
    }
  }
  itemToOperationType(type: string): enOPerationTypes {
    if(type === 'number') {
      return enOPerationTypes.number
    }
    if(type === 'kpi') {
      return enOPerationTypes.kpi
    }
    if(type === 'operator') {
      return enOPerationTypes.opt
    }
    if(type === 'function') {
      return enOPerationTypes.function
    }
    if(type === 'counter') {
      return enOPerationTypes.counter
    }
    else return enOPerationTypes.number;
  }
  itemToAggregationType(aggregation?: string): enAggregation {
    if(!aggregation) {
      return enAggregation.na
    }
    const lowerAgg = aggregation.toLowerCase();
    if(lowerAgg === 'sum') return enAggregation.sum;
    else if(lowerAgg === 'avg') return enAggregation.avg;
    else if(lowerAgg === 'count') return enAggregation.count;
    else if(lowerAgg === 'max') return enAggregation.max;
    else if(lowerAgg === 'min') return enAggregation.min;
    return enAggregation.na
  }
  bracketIndexOfClosing(items: TreeNodeViewModel[]): number | undefined {
    const brackets = [];
    for(let i = 0; i < items.length; i++) {
      if(items[i].name === '(') {
        brackets.push('(');
      }
      else if(items[i].name === ')') {
        brackets.pop();
      }
      if(brackets.length === 0) {
        return i;
      }
    }
    return undefined;
  }
  functionIndexOfClosing(items: TreeNodeViewModel[]): number | undefined {
    const brackets = [];
    for(let i = 1; i < items.length; i++) {
      if(items[i].name === '(') {
        brackets.push('(');
      }
      else if(items[i].name === ')') {
        brackets.pop();
      }
      if(brackets.length === 0) {
        return i;
      }
    }
    return undefined;
  }
  splitByComma(items: TreeNodeViewModel[]): TreeNodeViewModel[][] {
    const results: TreeNodeViewModel[][] = [];
    let i = 2;
    let start = 2;
    while(i < items.length) {
      if(items[i].type === 'function') {
        const q = this.functionIndexOfClosing(items.slice(i));
        if(!q) {
          throw('Cannot find closing index')
        }
        i =  i + q;
      } else if(items[i].name === '(') {
        const q = this.bracketIndexOfClosing(items.slice(i));
        if(!q) {
          throw('Cannot find closing index')
        }
        i =  i + q;
      } else if(items[i].name === ',') {
        results.push(items.slice(start,i));
        start = i + 1;
      }
      i++;
    }
    results.push(items.slice(start, items.length - 1))
    return results;
  }

  destroyKpiOperationChilds(operations: OperationDto[]): TreeNodeViewModel[] {
    const nodes: TreeNodeViewModel[] = [];
    let i = 0;
    while(i < operations.length) {
      switch(operations[i].type) {
        case(enOPerationTypes.voidFunction): {
          nodes.push(this.createOperatorByName('('), ...this.destroyKpiOperationChilds(operations[i].childs!), this.createOperatorByName(')'));
          i++;
          break;
        }
        case(enOPerationTypes.function): {
          nodes.push(
            this.buildRegularTreeNode(operations[i]),
            this.createOperatorByName('(')
          )
          operations[i].childs!.forEach(element => {
            nodes.push(
              ...this.destroyKpiOperationChilds(element.childs!),
              this.createOperatorByName(',')
            )
          });
          nodes[nodes.length - 1].name = ')';
          i++;
          break;
        }
        default: {
          nodes.push(this.buildRegularTreeNode(operations[i]));
          i++;
          break;
        }
      }
    }
    return nodes;
  }
  buildRegularTreeNode(operation: OperationDto): TreeNodeViewModel {
    return {
      id: 
      operation.type === enOPerationTypes.counter ? operation.counterId! : 
      operation.type === enOPerationTypes.function ? operation.functionId! :
      operation.type === enOPerationTypes.opt ? operation.operatorId! : 
      operation.type === enOPerationTypes.kpi ? operation.kpiId! : 0,
      order: operation.order,
      children: [],
      hasChild: false,
      name: operation.type === enOPerationTypes.counter ? operation.counterName! : 
      operation.type === enOPerationTypes.function ? operation.functionName! :
      operation.type === enOPerationTypes.opt ? operation.operatorName! : 
      operation.type === enOPerationTypes.kpi ? operation.kpiName! : operation.value!,
      type: this.operationTypeToItem(operation.type!),
      aggregation: this.aggregationTypeToItem(operation.aggregation!)
    }
  }
  operationTypeToItem(opType: enOPerationTypes): 'number' | 'kpi' | 'operator' | 'function' | 'number' | 'counter' {
    if(opType === enOPerationTypes.number) {
      return 'number'
    }
    if(opType === enOPerationTypes.kpi) {
      return 'kpi'
    }
    if(opType === enOPerationTypes.opt) {
      return 'operator'
    }
    if(opType === enOPerationTypes.function) {
      return 'function'
    }
    if(opType === enOPerationTypes.counter) {
      return 'counter'
    }
    else return 'number';
  }
  aggregationTypeToItem(agType: enAggregation): string | undefined{
    if(agType === enAggregation.avg) {
      return 'AVG'
    } else if(agType === enAggregation.sum) {
      return 'SUM'
    } else if(agType === enAggregation.count) {
      return 'COUNT'
    } else if(agType === enAggregation.max) {
      return 'MAX'
    } else if(agType === enAggregation.min) {
      return 'MIN'
    }
    return undefined
  }
  createOperatorByName(name: string): TreeNodeViewModel {
    return {
      name: name,
      children: [],
      hasChild: false,
      id: 0,
      type: 'operator'
    }
  }

  
}
