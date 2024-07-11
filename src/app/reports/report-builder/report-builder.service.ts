import { Injectable, inject } from '@angular/core';
import { ContainerOfFilter, MeasureViewModel, ReportFilterDto, ReportLevelViewModel, ReportViewModel } from '../report';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ExtraField, TreeNodeViewModel, enLogicalOperator, enSortDirection } from '../../common/generic';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { OperationService } from '../../operations/operation.service';
import { ReportService } from '../report.service';

const validateMeasureNames : ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const arr = control as FormArray;
  if (!arr || arr.controls.length == 0) {
    return null;
  }
    const names = arr.controls.map(x => x.get('displayName')?.value);
    return names.find((item, index) => names.indexOf(item) !== index) ? { nameDuplication: true } : null
}
const validateLevelNames : ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const arr = control as FormArray;
  if (!arr || arr.controls.length == 0) {
    return null;
  }
    const names = arr.controls.map(x => x.get('name')?.value);
    return names.find((item, index) => names.indexOf(item) !== index) ? { nameDuplication: true } : null
}
const validateFilterFormGroup: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.get('value');
  const type = control.get('type');
  const isVariable = control.get('isVariable');
  if(!value || !type || !isVariable) {
    return null;
  }
  if(!isVariable.value) {
    if(!value.value || (value.value as any[]).length === 0 || (type.value === 'Date' && (value.value as any[]).length !== 2)) {
      return {invalidFilter: true}
    }
  }
  return null;
}

const validateHavingDate : ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const arr = control as FormArray;
  if (!arr || arr.controls.length == 0) {
    return null;
  }
    const haveDate = arr.controls.find(x => 
      x.get('logicalOperator')?.value === enLogicalOperator.AND &&
      (x.get('reportFilters') as FormArray).controls.find(c => c.get('logicalOperator')?.value === enLogicalOperator.AND && 
                                                                ['Day', 'Month'].includes(c.get('name')?.value) &&
                                                                c.get('isMandatory')?.value === true)
    )
    return !haveDate ? { noDate: true } : null
}

@Injectable({
  providedIn: 'root'
})
export class ReportBuilderService {
  private operationService = inject(OperationService);
  private reportService = inject(ReportService);
  createReportForm(report?: ReportViewModel, extraFields?: ExtraField[], isClone?: boolean): FormGroup {
    let frm = new FormGroup({
      id: new FormControl(isClone ? 0 : report?.id ?? 0, Validators.required),
      name: new FormControl(isClone ? (report?.name + '(Cloned)') : report?.name, {
        validators: Validators.required,
        updateOn: 'blur'
        }
      ),
      deviceId: new FormControl(report?.deviceId, {
        validators: Validators.required,
      }),
      isPublic: new FormControl(report?.isPublic ?? false, Validators.required),
      reportFields: new FormArray([]),
      measures: new FormArray([],[Validators.required, validateMeasureNames]),
      levels: new FormArray([], [Validators.required, validateLevelNames]),
      containerOfFilters: new FormArray([], [Validators.required, validateHavingDate])
    }, {asyncValidators: this.reportService.validateDeviceAndName(report?.name, report?.deviceId)});
    if (report?.reportFields && report.reportFields.length > 0) {
      this.resetExtraFields(frm, extraFields!, report)
    }
    report?.measures.forEach(m => {
      (frm.get('measures') as FormArray).push(this.createMeasureForm(m));
    });
    report?.levels.forEach(l => {
      (frm.get('levels') as FormArray).push(this.createLevelForm(l))
    });
    report?.containerOfFilters.forEach(cf => {
      (frm.get('containerOfFilters') as FormArray).push(this.createFilterContainerForm(cf))
    });
    return frm;
  }
  createContainerOfFilterFormArray(containerOfFilters: ContainerOfFilter[]): FormArray {
    const frmArray = new FormArray([] as any[]);
    containerOfFilters.forEach(cf => frmArray.push(this.createFilterContainerForm(cf, true)))
    return frmArray;
  }
  resetExtraFields(frm: FormGroup, extraFields: ExtraField[], report?: ReportViewModel) {
    (frm.get('reportFields') as FormArray).clear();
    extraFields.forEach(ef => {
      (frm.get('reportFields') as FormArray).push(new FormGroup({
        id: new FormControl(0),
        name: new FormControl(ef.name),
        fieldId: new FormControl(ef.id),
        type: new FormControl(ef.type),
        content: new FormControl(ef.content),
        value: new FormControl(report?.reportFields?.find(x => x.fieldId === ef.id)?.value, { validators: ef.isMandatory ? Validators.required : null })
      }))
    })
  }
  createLevelFormFromDrop(event: CdkDragDrop<any>): FormGroup {
    const f = { ...event.previousContainer.data[event.previousIndex] as any } as TreeNodeViewModel;
    const frm = new FormGroup({
      id: new FormControl(0, Validators.required),
      name: new FormControl(f.name),
      displayOrder: new FormControl(event.currentIndex, Validators.required),
      sortDirection: new FormControl(enSortDirection.asc, Validators.required),
      levelId: new FormControl(f.id, Validators.required)
    });
    return frm;
  }
  createEmptyMeasureForm(): FormGroup {
    return new FormGroup({
      id: new FormControl(0),
      displayName: new FormControl('', Validators.required),
      operation: new FormControl(null, Validators.required),
      chipItems: new FormControl([]),
      havings: new FormArray([])
    });
  }
  createMeasureFormFromDrop(item: TreeNodeViewModel): FormGroup {
    return new FormGroup({
      id: new FormControl(0),
      displayName: new FormControl(item.name, Validators.required),
      operation: new FormControl(null, Validators.required),
      chipItems: new FormControl([item], Validators.required),
      havings: new FormArray([])
    });
  }
  createHavingForm(): FormGroup {
    return new FormGroup({
      id: new FormControl(0),
      operatorId: new FormControl('', Validators.required),
      logicOpt: new FormControl(enLogicalOperator.AND, Validators.required),
      value: new FormControl('', Validators.required)
    });
  }
  createFilterContainerFormFromDrop(event: CdkDragDrop<any>): FormGroup {
    const f = { ...event.previousContainer.data[event.previousIndex] as any } as TreeNodeViewModel;
    const frm = new FormGroup({
      id: new FormControl(0, Validators.required),
      logicalOperator: new FormControl(enLogicalOperator.AND, Validators.required),
      reportFilters: new FormArray([new FormGroup({
        id: new FormControl(0, Validators.required),
        name: new FormControl(f.name), //Must get the name of this filter
        logicalOperator: new FormControl(enLogicalOperator.AND, Validators.required),
        value: new FormControl([]),
        levelId: new FormControl(f.id, Validators.required),
        isMandatory: new FormControl(true, Validators.required),
        isVariable: new FormControl(false, Validators.required),
        type: new FormControl(f.type, Validators.required)
      }, [validateFilterFormGroup])], Validators.required),
    });
    return frm;
  }
  createFilterFormFromDrop(event: CdkDragDrop<any>): FormGroup {
    const f = { ...event.previousContainer.data[event.previousIndex] as any } as TreeNodeViewModel;
    const frm = new FormGroup({
      id: new FormControl(0, Validators.required),
      name: new FormControl(f.name), //Must get the name of this filter
      logicalOperator: new FormControl(enLogicalOperator.AND, Validators.required),
      value: new FormControl([]),
      levelId: new FormControl(f.id, Validators.required),
      isMandatory: new FormControl(true, Validators.required),
      isVariable: new FormControl(false, Validators.required),
      type: new FormControl(f.type, Validators.required)
    }, [validateFilterFormGroup]);
    return frm;
  }


  createLevelForm(item: ReportLevelViewModel): FormGroup {
    const frm = new FormGroup({
      id: new FormControl(item.id, Validators.required),
      name: new FormControl(item.levelName),
      displayOrder: new FormControl(item.displayOrder, Validators.required),
      sortDirection: new FormControl(item.sortDirection, Validators.required),
      levelId: new FormControl(item.levelId, Validators.required)
    });
    return frm;
  }
  createMeasureForm(item: MeasureViewModel): FormGroup {
    return new FormGroup({
      id: new FormControl(item.id),
      displayName: new FormControl(item.displayName, Validators.required),
      operation: new FormControl(item.operation, Validators.required),
      chipItems: new FormControl(this.operationService.destroyKpiOperationChilds(item.operation?.childs!), Validators.required),
      havings: new FormArray(item.havings?.map(x => {
        const havingGroup = new FormGroup({
          id: new FormControl(x.id, Validators.required),
          operatorId: new FormControl(x.operatorId, Validators.required),
          logicOpt: new FormControl(x.logicOpt, Validators.required),
          value: new FormControl(x.value, Validators.required)
        });
        return havingGroup;
      }) as FormGroup[])
    });
  }
  createFilterContainerForm(item: ContainerOfFilter, checkDisabled?: boolean): FormGroup {
    const frm = new FormGroup({
      id: new FormControl(item.id, Validators.required),
      logicalOperator: new FormControl(item.logicalOperator, Validators.required),
      reportFilters: new FormArray(item.reportFilters?.map(f => {
        return this.createFilterForm(f, checkDisabled!);
      }), Validators.required)
    });
    return frm;
  }
  createFilterForm(item: ReportFilterDto, checkDisabled?: boolean): FormGroup {
    const frm = new FormGroup({
      id: new FormControl(item.id, Validators.required),
      name: new FormControl(item.levelName), //Must get the name of this filter
      logicalOperator: new FormControl(item.logicalOperator, Validators.required),
      value: new FormControl({value: item.value ?? [], disabled: checkDisabled! && !item.isVariable},{validators: checkDisabled && item.isMandatory ? Validators.required : undefined}),
      levelId: new FormControl(item.levelId, Validators.required),
      isMandatory: new FormControl(item.isMandatory, Validators.required),
      isVariable: new FormControl(item.isVariable, Validators.required),
      type: new FormControl(item.type, Validators.required)
    }, [validateFilterFormGroup]);
    return frm;
  }
 
}
