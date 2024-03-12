import { GeneralFilterModel } from "techteec-lib/components/data-table/src/data-table.model";
import { enAggregation, enOPerationTypes } from "../common/generic";


export interface CreateKpi {
    id: number;
    name: string;
    deviceId: number | null;
    createdBy?: string | null;
    creationDate?: string;
    isPublic?: boolean;
    modifyBy?: string | null;
    modifyDate?: string | null;
    deletedBy?: string | null;
    deletedDate?: string | null;
    kpiFields?: ExtraFieldValue[] | null;
    operation?: OperationBinding;
}

export interface OperationDto {
    id: number;
    order: number;
    value: string | null;
    type: enOPerationTypes;
    aggregation: enAggregation;
    counterId: number | null;
    counterName: string | null;
    kpiId: number | null;
    kpiName: string | null;
    functionId: number | null;
    functionName: string | null;
    operatorId: number | null;
    operatorName: string | null;
    parentId: number | null;
    subsetId: number | null;
    subsetName: string | null;
    tableName: string | null;
    columnName: string | null;
    childs: OperationDto[] | null;
}


export interface ExtraFieldValue {
    id: number;
    fieldId: number;
    value: any;
}

export interface KpiFieldValueViewModel {
    id: number;
    fieldId: number;
    type: string;
    fieldName: string;
    value: any;
}

export interface KpiViewModel {
    id: number;
    name: string;
    deviceId: number | null;
    deviceName: string | null;
    createdBy: string;
    creationDate: string;
    isPublic: boolean;
    modifyBy: string | null;
    modifyDate: string | null;
    deletedBy: string | null;
    deletedDate: string | null;
    extraFields: KpiFieldValueViewModel[] | null;
    operations: OperationDto;
}

export interface KpiFilterModel extends GeneralFilterModel {
    deviceId: number | null;
    extraFields: { [key: string]: any; } | null;
}

export interface Filter {
    key: string;
    values: any;
}

export interface OperationBinding {
    id: number;
    order: number;
    value?: string | null;
    type?: enOPerationTypes;
    aggregation?: enAggregation;
    counterId?: number | null;
    kpiId?: number | null;
    functionId?: number | null;
    operatorId?: number | null;
    parentId?: number | null;
    childs?: OperationBinding[] | null;
}

export interface KpiListViewModel {
    id: number;
    name: string;
    deviceId: number | null;
    deviceName: string | null;
    createdBy: string;
    creationDate: string;
    isPublic: boolean;
    modifyBy: string | null;
    modifyDate: string | null;
    deletedBy: string | null;
    deletedDate: string | null;
    extraFields: KpiFieldValueViewModel[] | null;
}

export interface QueryExpress {
    leftSide: string;
    inside: string;
    rightSide: string;
}

export interface QueryWithJoinExpress {
    basicQuery: string;
    tables: string[];
}