import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, inject } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, map, merge, of, startWith, switchMap, tap } from 'rxjs';
import { ReportService } from '../report.service';
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Unsubscriber } from 'techteec-lib/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
@Component({
  selector: 'app-report-filter-control',
  standalone: true,
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatButtonModule,
    MatGridListModule
  ],
  templateUrl: './report-filter-control.component.html',
  styleUrl: './report-filter-control.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class ReportFilterControlComponent extends Unsubscriber implements OnChanges {
  @Input() levelId!: number;
  @Input() placeHolder: string = 'Select Values';
  @Input() label!: string;
  @Input() valueControl: AbstractControl<any, any> | null = new FormControl([]);
  @Input() isMandatory = false;
  @Input() type: string = 'List';
  filterCtrl = new FormControl('');
  dateCtrl1 = new FormControl<Date | undefined>(undefined);
  dateCtrl2 = new FormControl<Date | undefined>(undefined);
  @ViewChild('autoInput') autoInput!: ElementRef<HTMLInputElement>;
  private reportService = inject(ReportService);
  filteredOptions: Observable<string[]> = of([]);
  selectedOptions: string[] = [];
  loadingFilterOptions$ = this.reportService.loadingFilterOptions$;
  constructor() {
    super();
    this.filteredOptions = this.filterCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((searchQuery: string | null) => this.reportService.getFilterOptions(this.levelId, searchQuery, 0, 20))
    );
  }
  ngOnChanges(): void {
    this.dateCtrl1.removeValidators(Validators.required);
    this.dateCtrl2.removeValidators(Validators.required);
    this.filterCtrl.removeValidators(Validators.required);
    this.dateCtrl1.enable();
    this.dateCtrl2.enable();
    this.filterCtrl.enable();
    if(this.type === 'List') {
      this.selectedOptions = this.valueControl?.value;
    } else if(this.type === 'Date' && this.valueControl?.value && (this.valueControl?.value as string[]).length === 2) {
      this.dateCtrl1.setValue(this.convertNumberStringToDate(this.valueControl?.value[0]))
      this.dateCtrl2.setValue(this.convertNumberStringToDate(this.valueControl?.value[1]))
    }

    if(this.isMandatory) {
      this.dateCtrl1.addValidators(Validators.required);
      this.dateCtrl2.addValidators(Validators.required);
      this.filterCtrl.addValidators(Validators.required);
    }
    if(this.valueControl?.disabled) {
      this.dateCtrl1.disable();
      this.dateCtrl2.disable();
      this.filterCtrl.disable();
    }
    this._otherSubscription = merge(this.dateCtrl1.valueChanges, this.dateCtrl2.valueChanges).pipe(
      tap(() => {
        if(!this.dateCtrl1.value || !this.dateCtrl2.value) {
          this.valueControl?.setValue([]);
        }
        else {
          const dStart = this.dateCtrl1.value as Date;
          const dEnd = this.dateCtrl2.value as Date;
          this.valueControl?.setValue([this.convertDateToNumberString(dStart), this.convertDateToNumberString(dEnd)])
        }
      })
    ).subscribe();
  }
  remove(str: string): void {
    const index = this.selectedOptions.indexOf(str);

    if (index >= 0) {
      this.selectedOptions.splice(index, 1);
      this.valueControl?.setValue(this.selectedOptions);
    }
  }
  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedOptions.push(event.option.viewValue);
    this.autoInput.nativeElement.value = '';
    this.filterCtrl.setValue(null);
    this.valueControl?.setValue(this.selectedOptions);
  }
  resetValue() {
    this.autoInput.nativeElement.value = '';
  }
  convertDateToNumberString(d: Date): string {
    return d.getFullYear().toString() +  (d.getMonth() + 1).toString().padStart(2, '0') + (d.getDate()).toString().padStart(2, '0');
  }
  convertNumberStringToDate(d: string): Date {
    if(d.length < 6) {
      return new Date();
    }
    return new Date(+d.substring(0,4),+d.substring(4,6) - 1,+d.substring(6,8));
  }
  clear() {
    this.selectedOptions = [];
    this.dateCtrl1.setValue(undefined);
    this.dateCtrl2.setValue(undefined);
    this.valueControl?.setValue([]);
  }
  setDateValue(days: number) {
    this.dateCtrl1.setValue(new Date());
    this.dateCtrl2.setValue(new Date());
  }

}
