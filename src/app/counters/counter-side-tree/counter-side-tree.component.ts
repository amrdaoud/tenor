import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { CounterService } from '../counter.service';
import { FlatTreeNode, TreeNodeViewModel } from '../../common/generic';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Unsubscriber } from 'techteec-lib/common';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, expand, filter, finalize, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { DomSanitizer } from '@angular/platform-browser';
import { COUNTER_ICON, DEVICE_ICON, SET_ICON, SUBSET_ICON } from '../../common/app-icons.const';
import { CollectionViewer, ListRange } from '@angular/cdk/collections';

@Component({
  selector: 'app-counter-side-tree',
  standalone: true,
  imports: [CommonModule, MatTreeModule, MatIconModule, MatProgressSpinnerModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, CdkDrag, CdkDropList],
  templateUrl: './counter-side-tree.component.html',
  styleUrl: './counter-side-tree.component.scss'
})
export class CounterSideTreeComponent extends Unsubscriber implements OnInit {
  // @Input() deviceId: number | undefined;
  @Input() connectedDragDropLists!: CdkDropList<any>[];
  @Output() selected = new EventEmitter<TreeNodeViewModel>();
  dataSourceViewer: CollectionViewer = {
    viewChange: new Observable<ListRange>()
   };
   expandedNodeList:any = [];
  private counterService = inject(CounterService);
  loadingRootDevices$ = this.counterService.loadingRootDevices$;
  treeControl!: FlatTreeControl<FlatTreeNode>;
  treeFlattener!: MatTreeFlattener<TreeNodeViewModel, FlatTreeNode>;
  dataSource!: MatTreeFlatDataSource<TreeNodeViewModel, FlatTreeNode>;
  searchControl = new FormControl('');
  dropList: FlatTreeNode[] = [];
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer){
    super();
    this.searchControl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(400),
      switchMap(val => this.counterService.getDeviceChildsByParentId(undefined, val!))
    ).subscribe(x => this.dataSource.data = x);
    iconRegistry.addSvgIconLiteral('counter-icon', sanitizer.bypassSecurityTrustHtml(COUNTER_ICON));
    iconRegistry.addSvgIconLiteral('device-icon', sanitizer.bypassSecurityTrustHtml(DEVICE_ICON));
    iconRegistry.addSvgIconLiteral('subset-icon', sanitizer.bypassSecurityTrustHtml(SUBSET_ICON));
    iconRegistry.addSvgIconLiteral('set-icon', sanitizer.bypassSecurityTrustHtml(SET_ICON));
  }
  ngOnInit(): void {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren);
    this.treeControl = new FlatTreeControl(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this._otherSubscription = this.counterService.getDeviceChildsByParentId(undefined, this.searchControl.value!).subscribe(x => this.dataSource.data = x);
    this._otherSubscription = this.dataSource.connect(this.dataSourceViewer).subscribe(data => {
      this.expandedNodeList = data;
    })
  }

  transformer(node: TreeNodeViewModel, level: number): FlatTreeNode {
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
    let currentNode = this.dataSource.data.find(x => x.id === node.id);
    
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
      if (node.type === 'device') {
        this._otherSubscription = this.counterService.getDeviceChildsByParentId(+node.id, this.searchControl.value!)
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
      else if (node.type === 'set') {
        this._otherSubscription = this.counterService.getSubsetsBySetId(+node.id, this.searchControl.value!)
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
      else if (node.type === 'subset') {
        this._otherSubscription = this.counterService.getCountersByParentId(+node.id, this.searchControl.value!)
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
    const node = this.treeControl.dataNodes.find(x => x.id === currentNode.id && x.level === level);
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
