import { of } from "rxjs";
import { ColumnDef, DataTableFilter, DataTableButtonObject } from "techteec-lib/components/data-table/src/data-table.model";

export const columns: ColumnDef[] = [
    {Name: '#', Property: 'id', IsSort: true},
    {Name: 'Name', Property: 'name', IsSort: true},
    {Name: 'Type', Property: 'typeName', IsSort: true},
    {Name: 'Content', Property: 'content'},
    {Name: 'KPI?', Property: 'isForKpi', IsSort: true, Highlights: [
        {Operation: '=', Value: true, AltText: 'YES', Color: 'rgb(26, 213, 152)', BackgroundColor: 'rgba(26, 213, 152,0.3)'},
        {Operation: '=', Value: false, AltText: 'NO', Color: 'rgb(234, 58, 61)', BackgroundColor: 'rgba(234, 58, 61, 0.2)'},
    ]},
    {Name: 'Report?', Property: 'isForReport', IsSort: true, Highlights: [
        {Operation: '=', Value: true, AltText: 'YES', Color: 'rgb(26, 213, 152)', BackgroundColor: 'rgba(26, 213, 152,0.3)'},
        {Operation: '=', Value: false, AltText: 'NO', Color: 'rgb(234, 58, 61)', BackgroundColor: 'rgba(234, 58, 61, 0.2)'},
    ]},
    {Name: 'Dashboard?', Property: 'isForDashboard', IsSort: true, Highlights: [
        {Operation: '=', Value: true, AltText: 'YES', Color: 'rgb(26, 213, 152)', BackgroundColor: 'rgba(26, 213, 152,0.3)'},
        {Operation: '=', Value: false, AltText: 'NO', Color: 'rgb(234, 58, 61)', BackgroundColor: 'rgba(234, 58, 61, 0.2)'},
    ]}
];
export const filters: DataTableFilter[] = [
    {
        ControlName: 'SearchQuery',
        Type: 'input',
        Label: 'Search',
        PlaceHolder: 'Search by Name'
    },
    {
        ControlName: 'isKpi',
        Type: 'select',
        Label: 'KPI?',
        PlaceHolder: 'Added to KPI',
        Data$: of([
            {name: 'Yes', value: true},
            {name: 'No', value: false}
        ]),
        DisplayProperty: 'name',
        ValueProperty: 'value'
    }
]
export const btns: DataTableButtonObject[] = [
    {
        Text: 'Add New ExtraFields',
        MatColor: 'primary',
        Icon: 'add'
    }
]