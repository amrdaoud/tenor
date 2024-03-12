import { Component, Inject, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ExtraFieldViewModel } from '../extra-fields';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ExtraFieldsService } from '../extra-fields.service';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { InputComponent, SelectComponent } from 'techteec-lib/controls';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmService } from 'techteec-lib/dialogs-and-templates';
import { Unsubscriber } from 'techteec-lib/common';
import { filter } from 'rxjs';
import { fieldTypes } from '../../common/generic';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'amr-extra-fields-form',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, ReactiveFormsModule, InputComponent, SelectComponent, MatButtonModule, MatDialogModule, MatSlideToggleModule],
  templateUrl: './extra-fields-form.component.html',
  styleUrl: './extra-fields-form.component.scss'
})
export class ExtraFieldsFormComponent extends Unsubscriber {
  private extraFieldsService = inject(ExtraFieldsService);
  private dialogRef = inject(MatDialogRef<ExtraFieldsFormComponent>)
  private confirm = inject(ConfirmService);
  frm: FormGroup;
  fieldTypes = Object.values(fieldTypes).slice(0,Object.values(fieldTypes).length / 2).map((x,i) => {return {name: x, value: Object.values(fieldTypes)[i + (Object.values(fieldTypes).length / 2)]}})
  constructor(@Inject(MAT_DIALOG_DATA) public extraFields?: ExtraFieldViewModel) {
    super();
    this.frm = this.extraFieldsService.createForm(extraFields)
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
      this.frm.setValue(this.extraFieldsService.createForm(this.extraFields).value);
      this.frm.markAsUntouched();
    });
    
  }
}
