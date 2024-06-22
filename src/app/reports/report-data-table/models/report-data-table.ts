import { ContainerOfFilter } from "../../report";

export interface TableColumn {
    name: string;
    type: string;
    pipe?: any;
}

export interface ReportPreviewColumnModel {
    name: string;
    type: string;
}

export interface ReportRehearsalModel {
    name: string;
    columns: ReportPreviewColumnModel[];
    containerOfFilters: ContainerOfFilter[];
}