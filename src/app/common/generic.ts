export interface DataWithSize<T> {
    data: T[];
    dataSize: number;
}
export interface ExtraField {
    id: number;
    name: string;
    type: 'MultiSelectList' | 'List' | 'Text'
    content: string[];
    isMandatory: boolean
}
export interface TreeNodeViewModel {
    id: number;
    name: string;
    type: 'counter' | 'subset' | 'device' | 'number' | 'kpi' | 'operator' | 'function';
    hasChild: boolean;
    children: TreeNodeViewModel[];
    aggregation?: string;
    order?: number;
}
export interface FlatTreeNode {
    id: number;
    name: string;
    type: string;
    level: number;
    expandable: boolean;
    isLoading: boolean;
    aggregation?: string;
  }

  export enum enOPerationTypes {
    counter,
    function,
    kpi,
    opt,
    voidFunction,
    number
}

export enum enAggregation {
    na,
    min,
    max,
    sum,
    avg,
    count
}

export enum fieldTypes {
    Text,
    MultiSelectList,
    List
}

export enum enSortDirection {
    asc,
    desc
}
export interface ResultWithMessage {
    data: any;
    message?: string;
}