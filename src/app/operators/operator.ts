export interface OperationModel {
  id: number;
  name?: string;
  argumentsCount: number;
  operations: any;
}

export interface FunctionModel {
  id: number;
  name?: string;
  argumentsCount: number;
  isBool: boolean;
  operations: any;
}
