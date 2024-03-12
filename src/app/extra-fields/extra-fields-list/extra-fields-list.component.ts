import { Component, inject } from '@angular/core';
import { ExtraFieldsService } from '../extra-fields.service';
import { btns, columns, filters } from '../extra-fields.const';
import { ExtraFieldsListViewModel } from '../extra-fields';
import { MatGridListModule } from '@angular/material/grid-list';
import { DataTableComponent } from 'techteec-lib/components/data-table';
import { DataTableFilter, GeneralFilterModel } from 'techteec-lib/components/data-table/src/data-table.model';
import { Unsubscriber } from 'techteec-lib/common';
import { CommonModule } from '@angular/common';
import { filter, of, switchMap } from 'rxjs';
import { MatDialog }  from '@angular/material/dialog';
import { ExtraFieldsFormComponent } from '../extra-fields-form/extra-fields-form.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'amr-extra-fields-list',
  standalone: true,
  imports: [CommonModule, MatGridListModule, DataTableComponent, MatProgressSpinnerModule],
  templateUrl: './extra-fields-list.component.html',
  styleUrl: './extra-fields-list.component.scss'
})
export class ExtraFieldsListComponent extends Unsubscriber {
  private extraFieldsService = inject(ExtraFieldsService);
  loadingList$ = this.extraFieldsService.loadingList$;
  loadingElement$ = this.extraFieldsService.loadingElement$;
  columns = columns;
  filters = filters;
  btns = btns;
  data: ExtraFieldsListViewModel[] = [];
  dataSize = 0;
  latestFilter!: GeneralFilterModel;
  private dialog = inject(MatDialog);
  changed(filter: GeneralFilterModel) {
    this._otherSubscription = this.extraFieldsService.getByFilter(filter).subscribe(x => {
      this.data = x.data;
      this.dataSize = x.dataSize;
    })
  }
  btnClicked(btnIndex: number) {
    if(btnIndex == 0) {
      this._otherSubscription = this.dialog.open(ExtraFieldsFormComponent, {panelClass: 'techteec-form-dialog'}).afterClosed().pipe(
        filter(bindingObject => bindingObject),
        switchMap(bindingObject => this.extraFieldsService.addElement(bindingObject))
      ).subscribe(viewObject => this.changed(this.latestFilter))
    }
  }
  rowClicked(element: ExtraFieldsListViewModel) {
    this._otherSubscription = this.extraFieldsService.getById(element.id).pipe(
      switchMap(viewObject => this.dialog.open(ExtraFieldsFormComponent, {panelClass: 'techteec-form-dialog', data: viewObject}).afterClosed()),
      filter(bindingObject => bindingObject),
      switchMap(bindingObject => this.extraFieldsService.editElement(bindingObject))
    ).subscribe(viewObject => this.changed(this.latestFilter))
  }
}
