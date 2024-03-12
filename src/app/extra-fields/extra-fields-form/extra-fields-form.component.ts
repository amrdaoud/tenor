import { Component, Inject, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ExtraFieldsViewModel } from '../extra-fields';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ExtraFieldsService } from '../extra-fields.service';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { InputComponent, SelectComponent } from 'techteec-lib/controls';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmService } from 'techteec-lib/dialogs-and-templates';
import { Unsubscriber } from 'techteec-lib/common';
import { filter } from 'rxjs';

@Component({
  selector: 'amr-extra-fields-form',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, ReactiveFormsModule, InputComponent, SelectComponent, MatButtonModule, MatDialogModule],
  templateUrl: './extra-fields-form.component.html',
  styleUrl: './extra-fields-form.component.scss'
})
export class ExtraFieldsFormComponent extends Unsubscriber {
  private extraFieldsService = inject(ExtraFieldsService);
  private dialogRef = inject(MatDialogRef<ExtraFieldsFormComponent>)
  private confirm = inject(ConfirmService);
  frm: FormGroup;
  extraPropertyList = [
    {name: 'a', value: '1'},
    {name: 'b', value: '2'},
    {name: 'c', value: '3'}
  ]
  constructor(@Inject(MAT_DIALOG_DATA) public extraFields?: ExtraFieldsViewModel) {
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
