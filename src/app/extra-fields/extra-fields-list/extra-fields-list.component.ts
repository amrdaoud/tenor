import { Component, inject } from '@angular/core';
import { ExtraFieldsService } from '../extra-fields.service';
import { btns, columns, filters, menuBtns } from '../extra-fields.const';
import { ExtraFieldListViewModel } from '../extra-fields';
import { MatGridListModule } from '@angular/material/grid-list';
import { DataTableComponent } from 'techteec-lib/components/data-table';
import { DataTableFilter, GeneralFilterModel, MenuClickEvent } from 'techteec-lib/components/data-table/src/data-table.model';
import { Unsubscriber } from 'techteec-lib/common';
import { CommonModule } from '@angular/common';
import { filter, of, switchMap } from 'rxjs';
import { MatDialog }  from '@angular/material/dialog';
import { ExtraFieldsFormComponent } from '../extra-fields-form/extra-fields-form.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmService } from 'techteec-lib/dialogs-and-templates';

@Component({
  selector: 'amr-extra-fields-list',
  standalone: true,
  imports: [CommonModule, MatGridListModule, DataTableComponent, MatProgressSpinnerModule],
  templateUrl: './extra-fields-list.component.html',
  styleUrl: './extra-fields-list.component.scss'
})
export class ExtraFieldsListComponent extends Unsubscriber {
  private extraFieldsService = inject(ExtraFieldsService);
  private confirm = inject(ConfirmService);
  loadingList$ = this.extraFieldsService.loadingList$;
  loadingElement$ = this.extraFieldsService.loadingElement$;
  columns = columns;
  filters = filters;
  btns = btns;
  menuBtns = menuBtns;
  loadingElementRows$ = this.extraFieldsService.loadingElementRow$;
  data: ExtraFieldListViewModel[] = [];
  dataSize = 0;
  latestFilter!: GeneralFilterModel;
  private dialog = inject(MatDialog);
  changed(filter: GeneralFilterModel) {
    this.latestFilter = filter;
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
  rowClicked(model: ExtraFieldListViewModel) {
    this._otherSubscription = this.extraFieldsService.getById(model.id).pipe(
      switchMap(viewObject => this.dialog.open(ExtraFieldsFormComponent, {panelClass: 'techteec-form-dialog', data: viewObject}).afterClosed()),
      filter(bindingObject => bindingObject),
      switchMap(bindingObject => this.extraFieldsService.editElement(bindingObject, -1))
    ).subscribe(viewObject => this.changed(this.latestFilter))
  }
  menuClicked(event: MenuClickEvent) {
    if(event.index === 0) {
      this._otherSubscription = this.extraFieldsService.getById(event.target.id).pipe(
        switchMap(viewObject => this.dialog.open(ExtraFieldsFormComponent, {panelClass: 'techteec-form-dialog', data: viewObject}).afterClosed()),
        filter(bindingObject => bindingObject),
        switchMap(bindingObject => this.extraFieldsService.editElement(bindingObject, event.targetIndex))
      ).subscribe(viewObject => this.changed(this.latestFilter))
    } else if(event.index === 1) {
      this._otherSubscription = this.confirm.open({Title: 'Deleting Extra Field', Message: `Are you sure you want to delete Field "${event.target.name}"?`, MatColor:'warn'}).pipe(
        filter(result => result),
        switchMap(() => this.extraFieldsService.deleteElement(event.target.id, event.targetIndex))
      ).subscribe(viewObject => {
        this.changed(this.latestFilter)
      })
    }
  }
}
