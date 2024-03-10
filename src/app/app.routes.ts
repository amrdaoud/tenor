import { Routes} from '@angular/router';

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
          ),
      },
      {
        path: 'devices',
        loadComponent: () =>
          import('./devices/device-list/device-list.component').then(
            (c) => c.DeviceListComponent
          ),
      },

      {
        path: 'kpis/devices',
        loadComponent: () =>
          import('./devices/kpi-device/kpi-device.component').then(
            (c) => c.KpiDeviceComponent
          ),
      },
      {
        path: 'counters',
        loadComponent: () =>
          import('./counters/counter-list/counter-list.component').then(
            (c) => c.CounterListComponent
          ),
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
          ),
      },
      {
        path: 'kpis/edit/:kpiId',
        loadComponent: () =>
          import('./kpis/amr-kpi-builder/amr-kpi-builder.component').then(
            (c) => c.AmrKpiBuilderComponent
          ),
      }
    ],
  },
  {
    path: 'kpis',
    pathMatch: 'full',
    redirectTo: 'kpis/list'
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
