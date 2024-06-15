import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { FILTER_ICON } from 'techteec-lib/common';

@Component({
  selector: 'app-report-data-table',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './report-data-table.component.html',
  styleUrl: './report-data-table.component.scss'
})
export class ReportDataTableComponent {
  
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIconLiteral('filter-icon', sanitizer.bypassSecurityTrustHtml(FILTER_ICON));
  }
}
