export interface SubsetListViewModel {
    id: number;
    name: string;
    description: string;
    tableName: string;
    refTableName: string,
    schemaName: string,
    refSchema: string,
    maxDataDate: number,
    isLoad: boolean,
    dataTS: string,
    indexTS: string,
    dbLink: string,
    refDbLink: string,
    //isDeleted: boolean,
    supplierId: number
}
export interface SubsetViewModel {

}
export interface SubsetBindingModel {
    
}