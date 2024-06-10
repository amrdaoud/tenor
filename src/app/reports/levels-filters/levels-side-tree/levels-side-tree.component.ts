import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, inject } from '@angular/core';
import { FlatTreeNode, TreeNodeViewModel } from '../../../common/generic';
import { ReportService } from '../../report.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { Unsubscriber } from 'techteec-lib/common';
import { ReportMeasureDto } from '../../report';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { CollectionViewer, ListRange } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { DIMENSION_ICON, LEVEL_ICON } from '../../../common/app-icons.const';

@Component({
  selector: 'app-levels-side-tree',
  standalone: true,
  imports: [CommonModule, MatTreeModule, CdkDropList, CdkDrag, MatIconModule, MatProgressSpinnerModule, MatButtonModule],
  templateUrl: './levels-side-tree.component.html',
  styleUrl: './levels-side-tree.component.scss'
})
export class LevelsSideTreeComponent extends Unsubscriber implements OnChanges {
  @Input() reportMeasures!: ReportMeasureDto[];
  @Input() type: 'levels' | 'filters' = 'levels';
  @Input() connectedDragDropLists!: CdkDropList<any>[];
  @Output() selected = new EventEmitter<TreeNodeViewModel>();
  private reportService = inject(ReportService);
  dataSourceViewer: CollectionViewer = {
    viewChange: new Observable<ListRange>()
   };
   expandedNodeList:any = [];
  loadingLevels$ = this.reportService.loadingLevels$;
  loadingFilters$ = this.reportService.loadingFilters$;
  treeControl!: FlatTreeControl<FlatTreeNode>;
  treeFlattener!: MatTreeFlattener<TreeNodeViewModel, FlatTreeNode>;
  dataSource!: MatTreeFlatDataSource<TreeNodeViewModel, FlatTreeNode>;
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    super();
    iconRegistry.addSvgIconLiteral('dimension-icon', sanitizer.bypassSecurityTrustHtml(DIMENSION_ICON));
    iconRegistry.addSvgIconLiteral('level-icon', sanitizer.bypassSecurityTrustHtml(LEVEL_ICON));
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(!changes['reportMeasures']) {
      return;
    }
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren);
    this.treeControl = new FlatTreeControl(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    if(this.reportMeasures && this.reportMeasures.length > 0) {
      this._otherSubscription = this.type == 'levels' ?
      this.reportService.getLevelsByMeasures(this.reportMeasures).subscribe(x => this.dataSource.data = x) :
      this.reportService.getFiltersByMeasures(this.reportMeasures).subscribe(x => this.dataSource.data = x);
    } else {
      this.dataSource.data = [];
    }
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
      supplierId: node.supplierId,
      isFilter: node.isFilter,
      isLevel: node.isLevel,
    };
  }
  getLevel(node: FlatTreeNode): number {
    return node.level;
  }
  isExpandable(node: FlatTreeNode): boolean {
    return node.expandable;
  }
  hasChild(index: number, node: FlatTreeNode): boolean {
    return node.expandable;
  }
  getChildren(node: TreeNodeViewModel): TreeNodeViewModel[] | null | undefined {
    return node.childs;
  }
  selectElement(element: TreeNodeViewModel) {
    this.selected.emit(element);
  }
}
