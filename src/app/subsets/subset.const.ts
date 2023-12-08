import { ColumnDef, DataTableFilter, DataTableButtonObject } from "techteec-lib/components/data-table/src/data-table.model";

export const columns: ColumnDef[] = [
    {Name: '#', Property: 'id', IsSort: true},
    {Name: 'Supplier#', Property: 'supplierId', IsSort: true},
    {Name: 'Name', Property: 'name', IsSort: true},
    {Name: 'Schema', Property: 'schemaName', IsSort: true},
    {Name: 'Table', Property: 'tableName', IsSort: true},
    {Name: 'Ref Schema', Property: 'refSchema', IsSort: true},
    {Name: 'Ref Table', Property: 'refTableName', IsSort: true},
    {Name: 'Max Data On', Property: 'maxDataDate', IsSort: true},
    {Name: 'Auto Load?', Property: 'isLoad', IsSort: true, Highlights:[
        {Operation: '=', Value: true, Color: 'rgb(26, 213, 152)', BackgroundColor: 'rgba(26, 213, 152,0.3)', AltText: 'YES'},
        {Operation: '=', Value: false, Color: 'rgb(234, 58, 61)', BackgroundColor: 'rgba(234, 58, 61, 0.2)', AltText: 'NO'}
    ]},
];
export const filters: DataTableFilter[] = [
    {
        ControlName: 'SearchQuery',
        Type: 'input',
        Label: 'Search',
    }
]
export const btns: DataTableButtonObject[] = [
    {
        Text: 'Add New Subset',
        MatColor: 'primary',
        Icon: 'add'
    }
]