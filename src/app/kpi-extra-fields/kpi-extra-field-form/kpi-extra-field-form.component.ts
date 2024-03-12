import { Component, Inject, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CreateExtraFieldViewModel, KpiExtraFieldViewModel } from '../kpi-extra-field';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { KpiExtraFieldService } from '../kpi-extra-field.service';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { InputComponent, SelectComponent } from 'techteec-lib/controls';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmService } from 'techteec-lib/dialogs-and-templates';
import { Unsubscriber } from 'techteec-lib/common';
import { filter } from 'rxjs';
import { fieldTypes } from '../../common/generic';

@Component({
  selector: 'amr-kpi-extra-field-form',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, ReactiveFormsModule, InputComponent, SelectComponent, MatButtonModule, MatDialogModule],
  templateUrl: './kpi-extra-field-form.component.html',
  styleUrl: './kpi-extra-field-form.component.scss'
})
export class KpiExtraFieldFormComponent extends Unsubscriber {
  private kpiExtraFieldService = inject(KpiExtraFieldService);
  private dialogRef = inject(MatDialogRef<KpiExtraFieldFormComponent>)
  private confirm = inject(ConfirmService);
  frm: FormGroup;
  extraPropertyList = Object.values(fieldTypes)
  .slice(0,Object.values(fieldTypes).length / 2).map((x, i) => {return {name: x, value: Object.values(fieldTypes)[i + Object.values(fieldTypes).length / 2]}})
  constructor(@Inject(MAT_DIALOG_DATA) public kpiExtraField?: CreateExtraFieldViewModel) {
    super();
    this.frm = this.kpiExtraFieldService.createForm(kpiExtraField)
  }
  submit() {
    if(this.frm.invalid) {
      return;
    }
    this._otherSubscription = this.confirm.open({Message: 'Are you sure you want to proceed?'}).pipe(
      filter(confirmed => confirmed)
    ).subscribe(x => this.dialogRef.close(this.frm.value));
  }
  reset() {
    this._otherSubscription = this.confirm.open({Message: 'Are you sure you want to reset values?'}).pipe(
      filter(confirmed => confirmed)
    ).subscribe(x => {
      this.frm.setValue(this.kpiExtraFieldService.createForm(this.kpiExtraField).value);
      this.frm.markAsUntouched();
    });
    
  }
}
