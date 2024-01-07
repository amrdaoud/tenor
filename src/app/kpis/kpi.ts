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
  type!: number;
  name!: string;
  value = name;
  order!: number;
  parent!: number;
  aggregation!: number;
  counterId!: number;
  operatorId!: number;
  FunctionId!: number;
  kpiId!: number;
  childs = new Array<KpiModel>();
}

export class KpiModelInit {
  id: number = 0;
  name: string = '';
  operation!: KpiModel;
  deviceId = 400;
  kpiFields: any = [
    {
      id: 0,
      fieldId: 0,
      value: '',
    },
  ];
}
