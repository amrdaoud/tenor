import { Component, Input, inject } from '@angular/core';
import { ControlContainer, FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ExtraField } from '../../common/generic';
import { InputComponent, SelectComponent } from 'techteec-lib/controls';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { DeviceService } from '../../devices/device.service';

@Component({
  selector: 'app-shared-form-controls',
  standalone: true,
  imports: [CommonModule, InputComponent, MatSlideToggleModule, SelectComponent, ReactiveFormsModule],
  templateUrl: './shared-form-controls.component.html',
  styleUrl: './shared-form-controls.component.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, {skipSelf: true})
    }
  ]
})
export class SharedFormControlsComponent {
  @Input() formGroup = new FormGroup({});
  @Input() formArrayName = '';
  private deviceService = inject(DeviceService);
  rootDevices$ = this.deviceService.getRootDevices();
  get extraFieldsArray(): FormGroup[] {
    return (this.formGroup.get(this.formArrayName) as FormArray).controls as FormGroup[]
  }
  getFieldObject(i: number): ExtraField {
    return this.extraFieldsArray[i].value as ExtraField;
  }
}
