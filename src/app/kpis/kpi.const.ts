import { of } from "rxjs";
import { ColumnDef, DataTableFilter, DataTableButtonObject } from "techteec-lib/components/data-table/src/data-table.model";

export const columns: ColumnDef[] = [
    {Name: '#', Property: 'id', IsSort: true},
    {Name: 'Name', Property: 'name', IsSort: true},
    {Name: 'Device', Property: 'deviceName', IsSort: true}
];
export const filters: DataTableFilter[] = [
    {
        ControlName: 'SearchQuery',
        Type: 'input',
        Label: 'Search',
        PlaceHolder: 'Search by Name'
    },
    {
        ControlName: 'technology',
        Label:'Technology',
        Data$: of([{Name: '2G', Value: '2G'}, {Name: '3G', Value: '3G'},{Name: 'LTE', Value: 'LTE'}]),
        DisplayProperty: 'Name',
        ValueProperty: 'Value',
        Type: 'select',
        IsMulti: true
    }
]
export const btns: DataTableButtonObject[] = [
    {
        Text: 'Add New Kpi',
        MatColor: 'primary',
        Icon: 'add'
    }
]