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

export interface ExtraFieldValue {
    id: number;
    fieldId: number;
    value: any;
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