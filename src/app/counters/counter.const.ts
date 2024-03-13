import {
  ColumnDef,
  DataTableFilter,
  DataTableButtonObject,
} from 'techteec-lib/components/data-table/src/data-table.model';

export const columns: ColumnDef[] = [
  { Name: '#', Property: 'id', IsSort: true },
  { Name: 'Code', Property: 'code', IsSort: true },
  { Name: 'Supplier#', Property: 'supplierId', IsSort: true },
  { Name: 'Name', Property: 'name', IsSort: true },
];
export const filters: DataTableFilter[] = [
  {
    ControlName: 'SearchQuery',
    Type: 'input',
    Label: 'Search',
    PlaceHolder: 'Search by Name',
  },
];
export const btns: DataTableButtonObject[] = [
  {
    Text: 'Add New Counter',
    MatColor: 'primary',
    Icon: 'add',
  },
];
