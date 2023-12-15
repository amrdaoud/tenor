export interface DataWithSize<T> {
    data: T[];
    dataSize: number;
}
export interface ExtraField {
    id: number;
    name: string;
    type: 'MultiSelectList' | 'List' | 'Text'
    content: string[];
}