import { Routes} from '@angular/router';
import { authGuard } from './app-core/guards/auth.guard';
import { unsavedGuard } from './app-core/guards/unsaved.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./side-nav/side-nav.component').then((c) => c.SideNavComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./home/home.component').then(
            (c) => c.HomeComponent
          )
      },
      {
        path: 'admin/subsets',
        loadComponent: () =>
          import('./subsets/subset-list/subset-list.component').then(
            (c) => c.SubsetListComponent
          ),canActivate: [authGuard], data: {Roles: ['admin']}
      },
      {
        path: 'admin/devices',
        loadComponent: () =>
          import('./devices/device-list/device-list.component').then(
            (c) => c.DeviceListComponent
          ),canActivate: [authGuard], data: {Roles: ['admin']}
      },
      {
        path: 'admin/counters',
        loadComponent: () =>
          import('./counters/counter-list/counter-list.component').then(
            (c) => c.CounterListComponent
          ),canActivate: [authGuard], data: {Roles: ['admin']}
      },
      {
        path: 'admin/extra-fields',
        loadComponent: () =>
          import('./extra-fields/extra-fields-list/extra-fields-list.component').then(
            (c) => c.ExtraFieldsListComponent
          ),canActivate: [authGuard], data: {Roles: ['admin']}
      },
      {
        path: 'kpis/devices',
        loadComponent: () =>
          import('./devices/kpi-device/kpi-device.component').then(
            (c) => c.KpiDeviceComponent
          ),canActivate: [authGuard], data: {Roles: ['admin', 'editor']}
      },
      {
        path: 'kpis/list',
        loadComponent: () =>
          import('./kpis/kpi-list/kpi-list.component').then(
            (c) => c.KpiListComponent
          ),
      },
      {
        path: 'reports/list',
        loadComponent: () =>
          import('./reports/report-list/report-list.component').then(
            (c) => c.ReportListComponent
          ),
      },
      {
        path: 'kpis/builder',
        loadComponent: () =>
          import('./kpis/kpi-builder/kpi-builder.component').then(
            (c) => c.KpiBuilderComponent
          ),canDeactivate: [unsavedGuard],canActivate: [authGuard], data: {Roles: ['admin', 'editor']}
      },
      {
        path: 'kpis/edit/:kpiId',
        loadComponent: () =>
          import('./kpis/kpi-builder/kpi-builder.component').then(
            (c) => c.KpiBuilderComponent
          ),
          canDeactivate: [unsavedGuard],canActivate: [authGuard], data: {Roles: ['admin', 'editor']}
      },
      {
        path: 'reports/builder',
        loadComponent: () =>
          import('./reports/report-builder/report-builder.component').then(
            (c) => c.ReportBuilderComponent
          ),
          canDeactivate: [unsavedGuard],
          canActivate: [authGuard], data: {Roles: ['admin', 'editor']}
      },
      {
        path: 'reports/edit/:reportId',
        loadComponent: () =>
          import('./reports/report-builder/report-builder.component').then(
            (c) => c.ReportBuilderComponent
          ),
          canActivate: [authGuard], data: {Roles: ['admin', 'editor']}
      },
      {
        path: 'reports/clone/:reportId',
        loadComponent: () =>
          import('./reports/report-builder/report-builder.component').then(
            (c) => c.ReportBuilderComponent
          ),
          canActivate: [authGuard], data: {Roles: ['admin', 'editor']}
      },
      {
        path: 'reports/preview-list',
        loadComponent: () =>
          import('./reports/report-preview-list/report-preview-list.component').then(
            (c) => c.ReportPreviewListComponent
          ),
          canActivate: [authGuard], data: {Roles: ['admin', 'editor', 'user']}
      },
    ],
  },
  {
    path: '403',
        loadComponent: () =>
          import('./app-core/redirects/not-eligible/not-eligible.component').then(
            (c) => c.NotEligibleComponent
          )
  }
  // {
  //   path: '**',
  //   redirectTo: '',
  //   loadComponent: () =>
  //     import('./kpis/kpi-builder/kpi-builder.component').then(
  //       (c) => c.KpiBuilderComponent
  //     ),
  // },
];
