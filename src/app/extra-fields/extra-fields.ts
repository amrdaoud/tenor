import { GeneralFilterModel } from "techteec-lib/components/data-table/src/data-table.model";

export interface ExtraFieldFilter extends GeneralFilterModel {
    isKpi: boolean,
    isReport: boolean,
    isDashboard: boolean
}
export interface ExtraFieldsListViewModel {
    id: number;
    name: string;
}
export interface ExtraFieldsViewModel {
    id: number;
    name: string;
    extraProperty: string;
}
export interface ExtraFieldsBindingModel {
    id: number;
    name: string;
    extraProperty: string;
}