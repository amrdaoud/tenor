import { ColumnDef, DataTableButtonObject } from "techteec-lib/components/data-table/src/data-table.model";

export const columns: ColumnDef[] = [
    { Name: '#', Property: 'id', IsSort: true },
    { Name: 'Name', Property: 'name', IsSort: true },
    { Name: 'Device', Property: 'deviceName', IsSort: true },
    {Name: 'Public?', Property: 'isPublic', IsSort: true, Highlights:[
        {Operation: '=', Value: true, Color: 'rgb(26, 213, 152)', BackgroundColor: 'rgba(26, 213, 152,0.3)', AltText: 'YES'},
        {Operation: '=', Value: false, Color: 'rgb(234, 58, 61)', BackgroundColor: 'rgba(234, 58, 61, 0.2)', AltText: 'NO'}
    ]},
    { Name: 'Creator', Property: 'createdBy', IsSort: true},
    { Name: 'Created on', Property: 'createdDate', IsSort: true},
  ];
  export const btns: DataTableButtonObject[] = [
    {
      Text: 'Add New Report',
      MatColor: 'primary',
      Icon: 'add',
    },
  ];
  export const menuBtns: DataTableButtonObject[] = [
    {
      Text: 'Edit Report',
      MatColor: 'primary',
      Icon: 'edit',
      ShowWhen: {
        Property: 'canEdit',
        Value: true
      }
    },
    {
      Text: 'Duplicate Report',
      MatColor: 'primary',
      Icon: 'file_copy',
    },
    {
      Text: 'Preview Report',
      MatColor: 'accent',
      Icon: 'visibility',
    },
    {
      Text: 'Delete',
      MatColor: 'warn',
      Icon: 'delete',
      ShowWhen: {
        Property: 'canEdit',
        Value: true
      }
    },
  ];