export interface KpiListViewModel {
    id: number;
    name: string;
    deviceName: string;
}
export interface KpiViewModel {
    id: number;
    name: string;
    extraProperty: string;
}
export interface KpiBindingModel {
    id: number;
    name?: string;
    extraProperty: string;
}

export class KpiModel {
  aggregation = 0;
  counterId = 0;
  kpiId = 0;
  functionId = 0;
  operatorId = 0;
  parentId = 0;
  type?: string;
  id?: number;
  name?: string;
  value = name;
  order?: number;
  parent?: number;
  childs = new Array<KpiModel>();
}

export class KpiModelInit {
  id: number = 0;
  name: string = '';
  operation!: KpiModel;
}
