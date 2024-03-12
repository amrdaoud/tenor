import { GeneralFilterModel } from "techteec-lib/components/data-table/src/data-table.model";
import { fieldTypes } from "../common/generic";

export interface ExtraFieldFilter extends GeneralFilterModel {
    isKpi: boolean,
    isReport: boolean,
    isDashboard: boolean
}
export interface ExtraFieldListViewModel {
    id: number;
    name: string;
}
export interface ExtraFieldViewModel {
    id: number;
    name: string;
    type: fieldTypes;
    typeName: string;
    content: string | null;
    url: string | null;
    isForKpi: boolean;
    isForReport: boolean;
    isForDashboard: boolean;
    isMandatory: boolean;
}

export interface ExtraFieldBindingModel {
    id: number;
    name: string;
    type: fieldTypes;
    content: string | null;
    url: string | null;
    isForKpi: boolean;
    isForReport: boolean;
    isForDashboard: boolean;
    isMandatory: boolean;
}