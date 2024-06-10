import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize, of, switchMap, tap } from 'rxjs';
import { Unsubscriber } from 'techteec-lib/common';
import { ReportService } from '../report.service';
import { DeviceService } from '../../devices/device.service';
import { ExtraField, FlatTreeNode, TreeNodeViewModel } from '../../common/generic';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InputComponent, SelectComponent } from 'techteec-lib/controls';
import { MatMenuModule } from '@angular/material/menu';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource, MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-report-side-list',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatButtonModule, ReactiveFormsModule, MatTreeModule,MatFormFieldModule, MatInputModule, MatIconModule, SelectComponent, MatMenuModule, InputComponent],
  templateUrl: './report-side-list.component.html',
  styleUrl: './report-side-list.component.scss'
})
export class ReportSideListComponent extends Unsubscriber implements OnInit{
  frm = new FormGroup<any>({
    searchQuery: new FormControl(''),
    extraFields: new FormGroup({}),
    deviceId: new FormControl(null)
  });
  @Output() selected = new EventEmitter<TreeNodeViewModel>();
  private reportService = inject(ReportService);
  private deviceService = inject(DeviceService);
  rootDevices$ = this.deviceService.getRootDevices();
  loadingList$ = this.reportService.loadingTreeUsers$;
  extraFields: ExtraField[] = [];
  treeControl!: FlatTreeControl<FlatTreeNode>;
  treeFlattener!: MatTreeFlattener<TreeNodeViewModel, FlatTreeNode>;
  dataSource!: MatTreeFlatDataSource<TreeNodeViewModel, FlatTreeNode>;
  constructor() {
    super();
  }
  ngOnInit(): void {
    this.frm.get('deviceId')?.valueChanges.pipe(
      switchMap(deviceId => {
        if (deviceId) {
          return this.reportService.getExtraFields(+deviceId)
        } else {
          this.frm.get('deviceId')?.setValue(undefined,{ emitEvent: false });
          return of([])
        }
      }),
      tap(() => {
        Object.keys(this.frm.get('extraFields')?.value).forEach(key => {
          (this.frm.get('extraFields') as FormGroup).removeControl(key);
        });
      }),
      tap((extraFields: ExtraField[]) => {
        this.extraFields = extraFields;
        extraFields.forEach((field) => {
          (this.frm.get('extraFields') as FormGroup).addControl(
            field.name.toString(),
            new FormControl('')
          );
        });
      })
    ).subscribe();
    this.frm.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(400),
      switchMap(val => this.reportService.getReportTreeUserNames(val))
    ).subscribe(x => this.dataSource.data = x);
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren);
    this.treeControl = new FlatTreeControl(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this._otherSubscription = this.reportService.getReportTreeUserNames(this.frm.value).subscribe(x => this.dataSource.data = x);
  }

  transformer(node: TreeNodeViewModel, level: number): FlatTreeNode {
    if(node.type === 'userName') {
      return {
        id: node.name,
        name: node.name,
        type: node.type,
        level,
        expandable: node.hasChild,
        isLoading: false,
        aggregation: node.aggregation,
        supplierId: node.supplierId
      };
    } else {
      return {
        id: node.id,
        name: node.name,
        type: node.type,
        level,
        expandable: node.hasChild,
        isLoading: false,
        aggregation: node.aggregation,
        supplierId: node.supplierId
      };
    }
    
  }

  /** Get the level of the node */
  getLevel(node: FlatTreeNode): number {
    return node.level;
  }

  /** Get whether the node is expanded or not. */
  isExpandable(node: FlatTreeNode): boolean {
    return node.expandable;
  }

  /** Get whether the node has children or not. */
  hasChild(index: number, node: FlatTreeNode): boolean {
    return node.expandable;
  }
  getChildren(node: TreeNodeViewModel): TreeNodeViewModel[] | null | undefined {
    return node.childs;
  }
  loadNodeChildren(node: FlatTreeNode) {
    let currentNode = node.type === 'device' ? this.dataSource.data.find(x => x.id === node.id) : this.dataSource.data.find(x => x.name === node.name);
    
    if (node.level === 1) {
      const parentNode = this.dataSource.data.find(x => x.childs?.find(y => y.id === node.id));
      currentNode = parentNode?.childs.find(x => x.id === node.id);
    }
    else if (node.level === 2) {
      const grandParentNode = this.dataSource.data.find(x => x.childs?.find(y => y.childs?.find(z => z.id === node.id)));
      const parentNode = grandParentNode?.childs.find(x => x.childs?.find(y => y.id === node.id));
      currentNode = parentNode?.childs.find(x => x.id === node.id);
    }
    else if (node.level === 3) {
      const grandGrandParentNode = this.dataSource.data.find(x => x.childs?.find(y => y.childs?.find(z => z.childs?.find(q => q.id === node.id))));
      const grandParentNode = grandGrandParentNode?.childs.find(x => x.childs?.find(y => y.childs?.find(z => z.id === node.id)));
      const parentNode = grandParentNode?.childs.find(x => x.childs?.find(y => y.id === node.id));
      currentNode = parentNode?.childs.find(x => x.id === node.id);
    }
    
    if (currentNode && currentNode.hasChild && (!(currentNode?.childs) || currentNode?.childs?.length === 0)) {
      node.isLoading = true;
      if (node.type === 'userName') {
        let val = this.frm.value;
        val.userName = node.name;
        this._otherSubscription = this.reportService.getReportTreeByUserName(val)
        .pipe(
          finalize(() => node.isLoading = false)
        )
        .subscribe(x => {
          currentNode!.childs = x;
          const expanded = this.treeControl.dataNodes.filter(x => this.treeControl.isExpanded(x));
          this.dataSource.data = [...this.dataSource.data];
          this.toggleNode(currentNode!,node.level, expanded);
        });
      }
      else if (node.type === 'device') {
        let val = this.frm.value;
        val.deviceId = node.id;
        this._otherSubscription = this.reportService.getReportTreeByUserNameDevice(val)
        .pipe(
          finalize(() => node.isLoading = false)
        )
        .subscribe(x => {
          currentNode!.childs = x;
          const expanded = this.treeControl.dataNodes.filter(x => this.treeControl.isExpanded(x));
          this.dataSource.data = [...this.dataSource.data];
          this.toggleNode(currentNode!,node.level, expanded);
        });
      }
    } else {
      this.toggleNode(currentNode!, node.level, []);
    }
  }
  toggleNode(currentNode: TreeNodeViewModel, level: number, expanded: FlatTreeNode[]) {
    expanded.forEach(ex => {
      const expandedNode = this.treeControl.dataNodes.find(x => x.id === ex.id && x.level === ex.level);
      this.treeControl.expand(expandedNode!)
    });
    const node = currentNode.type === 'device' ?this.treeControl.dataNodes.find(x => x.id === currentNode.id && x.level === level) : this.treeControl.dataNodes.find(x => x.name === currentNode.name && x.level === level);
    if (this.treeControl.isExpanded(node!)) {
      this.treeControl.collapse(node!);
    } else {
      this.treeControl.expand(node!);
    }
  }
  selectElement(element: TreeNodeViewModel) {
    this.selected.emit(element);
  }
}
