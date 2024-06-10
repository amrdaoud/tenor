import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, Input, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { filter, map } from 'rxjs';
import { ReportMeasureDto } from '../report';
import { LevelsSideTreeComponent } from "../levels-filters/levels-side-tree/levels-side-tree.component";
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { TreeNodeViewModel, enSortDirection } from '../../common/generic';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { ReportBuilderService } from '../report-builder/report-builder.service';
import { MatStepperNext, MatStepperPrevious } from '@angular/material/stepper';

@Component({
    selector: 'app-report-levels',
    standalone: true,
    templateUrl: './report-levels.component.html',
    styleUrl: './report-levels.component.scss',
    imports: [CommonModule, MatSidenavModule,
      LevelsSideTreeComponent, CdkDropList, MatIconModule, MatButtonModule,
      ReactiveFormsModule, MatCardModule, CdkDrag, MatStepperNext, MatStepperPrevious]
})
export class ReportLevelsComponent implements AfterViewInit {
  @Input() formArray = new FormArray<any>([]);
  @Input() measuresArray = new FormArray<any>([]);
  dropContainers:  CdkDropList<any>[] = [];
  reportMeasures: ReportMeasureDto[] = [];
  private reportBuilder = inject(ReportBuilderService);
  ngAfterViewInit(): void {
    this.measuresArray.valueChanges.pipe(
      filter(() => this.measuresArray.valid),
      map(x => x as ReportMeasureDto[])
    ).subscribe(x => this.reportMeasures = x);
  }
  get formArrayControls(): FormGroup[] {
    return this.formArray.controls.map(x => x as FormGroup);
  }
  dropLevel(event: CdkDragDrop<any[]>) {
    if(event.previousContainer === event.container) {
      this.rearrangeLevels(event);
    }
    else {
      this.formArray.insert(event.currentIndex, this.reportBuilder.createLevelFormFromDrop(event));
    }
    this.formArray.markAsDirty();
  }
  removeLevel(i: number) {
    this.formArray.removeAt(i);
    this.formArray.markAsDirty();
  }
  rearrangeLevels(event: CdkDragDrop<any[]>) {
    const currentMEasure = this.formArray.at(event.previousIndex);
    this.formArray.removeAt(event.previousIndex);
    this.formArray.insert(event.currentIndex, currentMEasure);
    this.formArray.markAsDirty();
  }
}
