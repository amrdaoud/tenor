import { Injectable } from '@angular/core';
import { CreateReport } from '../report';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ExtraField } from '../../common/generic';

@Injectable({
  providedIn: 'root'
})
export class ReportBuilderService {

  createReportForm(deviceId: number, extraFields: ExtraField[], report?: CreateReport): FormGroup {
    let frm = new FormGroup({
      id: new FormControl(report?.id ?? 0, Validators.required),
      name: new FormControl(report?.name, Validators.required),
      deviceId: new FormControl(report?.deviceId ?? deviceId, Validators.required),
      isPublic: new FormControl(report?.isPublic ?? false, Validators.required),
      reportFields: new FormArray([]),
      measures: new FormArray([], Validators.required),
      levels: new FormArray([],Validators.required),
      filters: new FormArray([], Validators.required)
    });
    extraFields.forEach(ef => {
      (frm.get('reportFields') as FormArray).push(new FormGroup({
        id: new FormControl(0),
        name: new FormControl(ef.name),
        fieldId: new FormControl(ef.id),
        type: new FormControl(ef.type),
        content: new FormControl(ef.content),
        value: new FormControl(report?.reportFields?.find(x => x.fieldId === ef.id)?.value, {validators: ef.isMandatory ? Validators.required : null} )
      }))
    });
    report?.measures.forEach(m => {
      (frm.get('measures') as FormArray).push(new FormGroup({
        id: new FormControl(m.id, Validators.required),
        displayName: new FormControl(m?.displayName, Validators.required),
        operation: new FormControl(m.operation, Validators.required),
        havings: new FormArray(m.havings?.map(x => {
          const havingGroup = new FormGroup({
            id: new FormControl(x.id, Validators.required),
            operatorId: new FormControl(x.operatorId, Validators.required),
            logicOpt: new FormControl(x.logicOpt, Validators.required),
            value: new FormControl(x.value, Validators.required)
          });
          return havingGroup;
        }) as FormGroup[])
      }));
    });
    report?.levels.forEach(l => {
      (frm.get('levels') as FormArray).push(new FormGroup({
        id: new FormControl(l.id, Validators.required),
        displayOrder: new FormControl(l.displayOrder, Validators.required),
        sortDirection: new FormControl(l.sortDirection, Validators.required),
        dimensionLevelId: new FormControl(l.dimensionLevelId, Validators.required)
      }))
    });
    report?.filters.forEach(f => {
      (frm.get('filters') as FormArray).push(new FormGroup({
        id: new FormControl(f.id, Validators.required),
        logicalOperator: new FormControl(f.logicalOperator, Validators.required),
        value: new FormControl(f.value),
        dimensionLevelId: new FormControl(f.dimensionLevelId, Validators.required)
      }))
    })
    return frm;
  }
  
}
