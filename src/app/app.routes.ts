import { Routes} from '@angular/router';
import { authGuard } from './app-core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./side-nav/side-nav.component').then((c) => c.SideNavComponent),
    children: [
      {
        path: 'subsets',
        loadComponent: () =>
          import('./subsets/subset-list/subset-list.component').then(
            (c) => c.SubsetListComponent
          ),canActivate: [authGuard], data: {Roles: ['admin']}
      },
      {
        path: 'devices',
        loadComponent: () =>
          import('./devices/device-list/device-list.component').then(
            (c) => c.DeviceListComponent
          ),canActivate: [authGuard], data: {Roles: ['admin']}
      },
      {
        path: 'counters',
        loadComponent: () =>
          import('./counters/counter-list/counter-list.component').then(
            (c) => c.CounterListComponent
          ),canActivate: [authGuard], data: {Roles: ['admin']}
      },
      {
        path: 'kpi-extra-fields',
        loadComponent: () =>
          import('./kpi-extra-fields/kpi-extra-field-list/kpi-extra-field-list.component').then(
            (c) => c.KpiExtraFieldListComponent
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
        path: 'kpis/builder/:deviceId',
        loadComponent: () =>
          import('./kpis/amr-kpi-builder/amr-kpi-builder.component').then(
            (c) => c.AmrKpiBuilderComponent
          ),canActivate: [authGuard], data: {Roles: ['admin', 'editor']}
      },
      {
        path: 'kpis/edit/:kpiId',
        loadComponent: () =>
          import('./kpis/amr-kpi-builder/amr-kpi-builder.component').then(
            (c) => c.AmrKpiBuilderComponent
          ),
          canActivate: [authGuard], data: {Roles: ['admin', 'editor']}
      }
    ],
  },
  {
    path: 'kpis',
    pathMatch: 'full',
    redirectTo: 'kpis/list'
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
