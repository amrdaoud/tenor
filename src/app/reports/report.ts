import { TreeNodeViewModel, enLogicalOperator, enSortDirection } from "../common/generic";
import { ExtraFieldValue, KpiFieldValueViewModel, OperationBinding, OperationDto } from "../kpis/kpi";

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
    logicalOperatorName: string;
    value: string[] | null;
    levelId: number;
    levelName: string;
    isMandatory: boolean;
    isVariable: boolean;
    type: string;
}
export interface Having {
    id: number;
    operatorId: number;
    logicOpt: enLogicalOperator;
    value: string;
}

///ViewModels

export interface ReportViewModel {
    id: number;
    name: string;
    deviceId: number;
    deviceName: string;
    isPublic: boolean;
    createdBy: string | null;
    createdDate: string | null;
    childId: number | null;
    measures: MeasureViewModel[];
    levels: ReportLevelViewModel[];
    reportFields: ReportFieldValueViewModel[] | null;
    containerOfFilters: ContainerOfFilter[];
    canEdit: boolean
}

export interface MeasureViewModel {
    id: number;
    displayName: string;
    operation: OperationDto;
    havings: HavingViewModel[];
}

export interface HavingViewModel {
    id: number;
    operatorId: number | null;
    operatorName: string | null;
    logicOpt: enLogicalOperator;
    logicOptName: string | null;
    value: number | null;
}


export interface ReportLevelViewModel {
    id: number;
    displayOrder: number;
    sortDirection: enSortDirection;
    sortDirectionName: string;
    levelId: number;
    levelName: string;
    isLevel: boolean;
    isFilter: boolean;
}

export interface ReportFieldValueViewModel {
    id: number;
    fieldId: number;
    type: string;
    fieldName: string;
    value: any;
}


export interface ContainerOfFilter {
    id: number;
    logicalOperator: enLogicalOperator;
    logicalOperatorName: string | null;
    reportFilters: ReportFilterDto[];
}
export interface ReportDto {
    id: number;
    name: string;
    deviceId: number;
    deviceName: string;
    isPublic: boolean;
    createdBy: string;
    createdDate: Date;
}