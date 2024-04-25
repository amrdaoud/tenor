import { Injectable, inject } from '@angular/core';
import { OperationBinding } from '../kpi';
import { ExtraField, TreeNodeViewModel, enAggregation, enOPerationTypes } from '../../common/generic';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { KpiViewModel, OperationDto } from '../kpi';
import { KpiService } from '../kpi.service';

@Injectable({
  providedIn: 'root'
})
export class KpiBuilderService {
  private kpiService = inject(KpiService);

  

  
}
