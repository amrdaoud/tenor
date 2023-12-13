export interface CounterListViewModel {
    id: number;
    code: string;
    supplierId: string;
    name: string;
    columnName: string;
    refColumnName: string;
    description: string;
    aggregation: string;
}
export interface CounterViewModel {
    id: number;
    name: string;
    extraProperty: string;
}
export interface CounterBindingModel {
    id: number;
    name: string;
    extraProperty: string;
}