import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { KpiListViewModel } from '../kpi';
import { KpiService } from '../kpi.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataWithSize, ExtraField, TreeNodeViewModel } from '../../common/generic';
import { Unsubscriber } from 'techteec-lib/common';
import { tap, switchMap, startWith, distinctUntilChanged, debounceTime, map } from 'rxjs';
import { MatListModule } from '@angular/material/list';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { MatMenuModule } from '@angular/material/menu';
import { InputComponent, SelectComponent } from 'techteec-lib/controls';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import { KPI_ICON } from '../../common/app-icons.const';

@Component({
  selector: 'app-kpi-side-list',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule,
    MatProgressSpinnerModule, CdkDropList, MatMenuModule,
    SelectComponent, InputComponent, MatButtonModule,
    ReactiveFormsModule, MatFormFieldModule, MatInputModule, CdkDrag],
  templateUrl: './kpi-side-list.component.html',
  styleUrl: './kpi-side-list.component.scss'
})
export class KpiSideListComponent extends Unsubscriber {
  @Input({required: true}) deviceId!: number;
  @Output() selected = new EventEmitter<TreeNodeViewModel>();
  public kpiService = inject(KpiService);
  loadingList$ = this.kpiService.loadingList$;
  frm = new FormGroup<any>({
    searchQuery: new FormControl(''),
    pageIndex: new FormControl(0),
    pageSize: new FormControl(20),
    sortActive: new FormControl('name'),
    sortDirection: new FormControl('asc'),
    extraFields: new FormGroup({})
  });
  itemList: any = [];
  listSize = 0;
  extraFields: ExtraField[] = [];
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    super();
    iconRegistry.addSvgIconLiteral('kpi-icon', sanitizer.bypassSecurityTrustHtml(KPI_ICON));
    this.kpiService
      .getExtraFields()
      .pipe(
        tap((extraFields: ExtraField[]) => {
          extraFields.forEach((field) => {
            (this.frm.get('extraFields') as FormGroup).addControl(
              field.name.toString(),
              new FormControl('')
            );
          });
        }),
        tap(
          (extraFields: ExtraField[]) => (
            (this.extraFields = extraFields)
          )
        ),
        switchMap(() => this.frm.valueChanges),
        startWith(this.frm.value),
        distinctUntilChanged(),
        debounceTime(400),
        tap(() => this.frm.get('pageIndex')?.setValue(0, { emitEvent: false })),
        switchMap(() => this.kpiService.getByFilter(this.frm.value)),
        map(x => {
          const d: DataWithSize<TreeNodeViewModel> = {
            dataSize: x.dataSize,
            data: x.data.map((kpi: KpiListViewModel) => {
              const t: TreeNodeViewModel = {
                id: kpi.id,
                children: [],
                hasChild: false,
                name: kpi.name,
                type: 'kpi'
              }
              return t;
            })
          }
          return d;
        })
      )
      .subscribe(c =>{
        this.itemList = c.data;
        this.listSize = c.dataSize;
      });
  }
  loadMore() {
    this.frm
      .get('pageIndex')
      ?.setValue(+this.frm.get('pageIndex')?.value + 1, { emitEvent: false });
    this._otherSubscription = this.kpiService
      .getByFilter(this.frm.value)
      .subscribe((c) => this.itemList.push(...c.data));
  }
  onScroll(event: any) {
    if (
      event.target.offsetHeight + event.target.scrollTop >=
      event.target.scrollHeight
    ) {
      if (this.listSize > this.itemList.length) {
        this.loadMore();
      }
    }
  }
  selectElement(element: TreeNodeViewModel) {    
    this.selected.emit(element);
  }
}
