import { Component, Inject, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CounterViewModel } from '../counter';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CounterService } from '../counter.service';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { InputComponent, SelectComponent } from 'techteec-lib/controls';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmService } from 'techteec-lib/dialogs-and-templates';
import { Unsubscriber } from 'techteec-lib/common';
import { filter } from 'rxjs';
import { SubsetService } from '../../subsets/subset.service';

@Component({
  selector: 'amr-counter-form',
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
  templateUrl: './counter-form.component.html',
  styleUrl: './counter-form.component.scss',
})
export class CounterFormComponent extends Unsubscriber {
  private counterService = inject(CounterService);
  private dialogRef = inject(MatDialogRef<CounterFormComponent>);
  private confirm = inject(ConfirmService);
  frm: FormGroup;
  extraPropertyList = [
    { name: 'a', value: '1' },
    { name: 'b', value: '2' },
    { name: 'c', value: '3' },
  ];
  constructor(@Inject(MAT_DIALOG_DATA) public counter?: CounterViewModel) {
    super();
    this.frm = this.counterService.createForm(counter);
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
        this.frm.setValue(this.counterService.createForm(this.counter).value);
        this.frm.markAsUntouched();
      });
  }
}
