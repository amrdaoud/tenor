import { Component, Inject, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { KpiViewModel } from '../kpi';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { KpiService } from '../kpi.service';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { InputComponent, SelectComponent } from 'techteec-lib/controls';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmService } from 'techteec-lib/dialogs-and-templates';
import { Unsubscriber } from 'techteec-lib/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-kpi-form',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    ReactiveFormsModule,
    InputComponent,
    SelectComponent,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './kpi-form.component.html',
  styleUrl: './kpi-form.component.scss',
})
export class KpiFormComponent extends Unsubscriber {
  private kpiService = inject(KpiService);
  private dialogRef = inject(MatDialogRef<KpiFormComponent>);
  private confirm = inject(ConfirmService);
  frm: FormGroup;
  extraPropertyList = [
    { name: 'a', value: '1' },
    { name: 'b', value: '2' },
    { name: 'c', value: '3' },
  ];
  constructor(@Inject(MAT_DIALOG_DATA) public kpi?: KpiViewModel) {
    super();
    this.frm = this.kpiService.createForm(kpi);
  }
  submit() {
    if (this.frm.invalid) {
      return;
    }
    this._otherSubscription = this.confirm
      .open({ Message: 'Are you sure you want to proceed?' })
      .pipe(filter((confirmed) => confirmed))
      .subscribe((x) => this.dialogRef.close(this.frm.value));
  }
  reset() {
    this._otherSubscription = this.confirm
      .open({ Message: 'Are you sure you want to reset values?' })
      .pipe(filter((confirmed) => confirmed))
      .subscribe((x) => {
        this.frm.setValue(this.kpiService.createForm(this.kpi).value);
        this.frm.markAsUntouched();
      });
  }
}
