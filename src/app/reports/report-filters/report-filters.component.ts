import { CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { enLogicalOperator } from '../../common/generic';
import { MatCheckboxModule } from '@angular/material/checkbox';
@Component({
  selector: 'app-report-filters',
  standalone: true,
  imports: [CommonModule ,MatSidenavModule, MatCardModule, MatIconModule, MatListModule, CdkDropList, MatCheckboxModule, ReactiveFormsModule],
  templateUrl: './report-filters.component.html',
  styleUrl: './report-filters.component.scss'
})
export class ReportFiltersComponent {
  @Input() formArray = new FormArray<any>([]);
  index = 0;
  get formArrayControls(): FormGroup[] {
    return this.formArray.controls.map(x => x as FormGroup);
  }
  get enLogicalOperator(): typeof enLogicalOperator {
    return enLogicalOperator; 
  }
  getFilterFormArray(i: number): FormArray {
    return this.formArrayControls[i].get('reportFilters') as FormArray;
  }
  getFilterControls(i: number): FormGroup[] {
    return this.getFilterFormArray(i).controls.map(x => x as FormGroup);
  }
  changeLogicalOpertor(containerForm: FormGroup) {
    containerForm.get('logicalOperator')?.setValue(containerForm.get('logicalOperator')?.value === 1 ? 0 : 1);
  }
  addContainer() {
    this.formArray.push(new FormGroup({
      id: new FormControl(0, Validators.required),
      logicalOperator: new FormControl(enLogicalOperator.AND, Validators.required),
      reportFilters: new FormArray([])
      // reportFilters: new FormArray(cf.ReportFilters?.map(f => {
      //   const reportFilterGroup = new FormGroup({
      //     id: new FormControl(f.id, Validators.required),
      //     name: new FormControl('') , //Must get the name of this filter
      //     logicalOperator: new FormControl(f.logicalOperator, Validators.required),
      //     value: new FormControl(f.value),
      //     dimensionLevelId: new FormControl(f.dimensionLevelId, Validators.required),
      //     isMandatory: new FormControl(f.isMandatory, Validators.required),
      //     isVariable: new FormControl(f.isVariable, Validators.required)
      //   });
      //   return reportFilterGroup;
      // }))
    
    }))
  }
  addFilter(containerFormIndex: number) {
    if(this.index == 0) {
      this.getFilterFormArray(containerFormIndex).push(new FormGroup({
        id: new FormControl(0, Validators.required),
        name: new FormControl('Geo: Region') , //Must get the name of this filter
        logicalOperator: new FormControl(enLogicalOperator.AND, Validators.required),
        value: new FormControl(['Southern']),
        levelId: new FormControl(0, Validators.required),
        isMandatory: new FormControl(true, Validators.required),
        isVariable: new FormControl(false, Validators.required)
    }));
    } else {
      this.getFilterFormArray(containerFormIndex).push(new FormGroup({
        id: new FormControl(0, Validators.required),
        name: new FormControl('Geo: ABCDEFGHIJKLMN') , //Must get the name of this filter
        logicalOperator: new FormControl(enLogicalOperator.OR, Validators.required),
        value: new FormControl(['Southern, Western']),
        levelId: new FormControl(0, Validators.required),
        isMandatory: new FormControl(true, Validators.required),
        isVariable: new FormControl(false, Validators.required)
    }));
    }
    
    this.index++;
  }
}
