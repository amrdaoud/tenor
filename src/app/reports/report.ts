import { TreeNodeViewModel, enLogicalOperator, enSortDirection } from "../common/generic";
import { ExtraFieldValue, KpiFieldValueViewModel, OperationBinding } from "../kpis/kpi";

export interface CreateReport {
    id: number;
    name: string;
    deviceId: number | null;
    isPublic?: boolean;
    childId: number | null;
    createdBy?: string | null;
    createdDate?: string;
    reportFields?: ExtraFieldValue[] | null;
    measures: ReportMeasureDto[];
    levels: ReportLevelDto[];
    containerOfFilters: ReportFilterContainer[];
    extraFields: KpiFieldValueViewModel[];
}
export interface ReportMeasureDto {
    id: number;
    displayName: string;
    operation?: OperationBinding;
    havings?: Having[] | null;
    chipItems?: TreeNodeViewModel[];
}
export interface ReportLevelDto {
    id: number;
    displayOrder: number;
    sortDirection: enSortDirection;
    dimensionLevelId: number;
}
export interface ReportFilterContainer {
    id: number,
    logicalOperator: enLogicalOperator;
    ReportFilters: ReportFilterDto[];
}
export interface ReportFilterDto {
    id: number;
    logicalOperator: enLogicalOperator;
    value: string[] | null;
    levelId: number;
    isMandatory: boolean;
    isVariable: boolean;
}
export interface Having {
    id: number;
    operatorId: number;
    logicOpt: enLogicalOperator;
    value: string;
}