import { Injectable, inject } from '@angular/core';
import { KpiService } from '../kpi.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ExtraField } from '../../common/generic';
import { KpiViewModel } from '../kpi';

@Injectable({
  providedIn: 'root'
})
export class KpiBuilderService {

  private kpiService = inject(KpiService);
  createKpiForm(kpi?: KpiViewModel, extraFields?:ExtraField[]): FormGroup {
    let frm = new FormGroup({
      id: new FormControl(kpi?.id ?? 0, Validators.required),
      name: new FormControl(kpi?.name, {
        validators: Validators.required,
        asyncValidators: this.kpiService.validateName('deviceId', kpi?.name),
        updateOn: 'blur'
        }),
      deviceId: new FormControl(kpi?.deviceId, {validators: Validators.required, asyncValidators: this.kpiService.validateDevice('name', kpi?.deviceId)}),
      isPublic: new FormControl(kpi?.isPublic ?? false, Validators.required),
      kpiFields: new FormArray([]),
      operation: new FormControl(kpi?.operations, Validators.required)
    });
    if(kpi?.extraFields && kpi.extraFields.length > 0) {
      this.resetExtraFields(frm,extraFields!,kpi)
    }
    return frm;
  }
  resetExtraFields(frm: FormGroup, extraFields: ExtraField[], kpi?: KpiViewModel) {
    (frm.get('kpiFields') as FormArray).clear();
    extraFields.forEach(ef => {
      (frm.get('kpiFields') as FormArray).push(new FormGroup({
        id: new FormControl(0),
        name: new FormControl(ef.name),
        fieldId: new FormControl(ef.id),
        type: new FormControl(ef.type),
        content: new FormControl(ef.content),
        value: new FormControl(kpi?.extraFields?.find(x => x.fieldId === ef.id)?.value, {validators: ef.isMandatory ? Validators.required : null} )
      }))
    })
  }
}
