import { ColumnDef, DataTableFilter, DataTableButtonObject } from "techteec-lib/components/data-table/src/data-table.model";

export const columns: ColumnDef[] = [
    {Name: '#', Property: 'id', IsSort: true},
    {Name: 'Name', Property: 'name', IsSort: true},
    {Name: 'Type', Property: 'typeName', IsSort: true},
    {Name: 'Content', Property: 'content', IsSort: true}
];
export const filters: DataTableFilter[] = [
    {
        ControlName: 'SearchQuery',
        Type: 'input',
        Label: 'Search',
        PlaceHolder: 'Search by Name'
    }
]
export const btns: DataTableButtonObject[] = [
    {
        Text: 'Add New Extra Field',
        MatColor: 'primary',
        Icon: 'add'
    }
]