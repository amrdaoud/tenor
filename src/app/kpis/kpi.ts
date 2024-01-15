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
  type: number = 0;
  name!: string;
  value = name;
  order!: number;
  parent: number = 0;
  aggregation: any;
  counterId: any;
  operatorId: any;
  functionId: any;
  kpiId: any;
  childs = new Array<KpiModel>();
}

export class KpiModelInit {
  id: any = 0;
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
