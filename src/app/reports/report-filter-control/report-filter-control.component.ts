import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, inject } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, debounceTime, map, merge, of, startWith, switchMap, tap } from 'rxjs';
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
    MatDatepickerModule
  ],
  templateUrl: './report-filter-control.component.html',
  styleUrl: './report-filter-control.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class ReportFilterControlComponent extends Unsubscriber implements OnInit {
  @Input() levelId!: number;
  @Input() placeHolder: string = 'Select Values';
  @Input() label!: string;
  @Input() valueControl: AbstractControl<any, any> | null = new FormControl([]);
  @Input() type: 'List' | 'Date' = 'List';
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
      switchMap((searchQuery: string | null) => this.reportService.getFilterOptions(this.levelId, searchQuery, 0, 20))
    );
  }
  ngOnInit(): void {
    if(this.valueControl?.disabled) {
      this.dateCtrl1.disable();
      this.dateCtrl2.disable();
      this.filterCtrl.disable();
    }
    if(this.type === 'List') {
      this.selectedOptions = this.valueControl?.value;
    } else if(this.type === 'Date' && this.valueControl?.value && (this.valueControl?.value as string[]).length === 2) {
      this.dateCtrl1.setValue(this.convertNumberStringToDate(this.valueControl?.value[0]))
      this.dateCtrl2.setValue(this.convertNumberStringToDate(this.valueControl?.value[1]))
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

}
