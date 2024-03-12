import { fieldTypes } from "../common/generic";

export interface KpiExtraFieldListViewModel {
    id: number;
    name: string;
}
export interface KpiExtraFieldViewModel {
    id: number;
    name: string;
    extraProperty: string;
}
export interface KpiExtraFieldBindingModel {
    id: number;
    name: string;
    extraProperty: string;
}


export interface CreateExtraFieldViewModel {
    id: number;
    name: string;
    type: fieldTypes;
    typeName: string;
    content: string | null;
    url: string | null;
}