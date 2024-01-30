import { bootstrapApplication } from '@angular/platform-browser';
import { Routes, provideRouter, withHashLocation } from '@angular/router';
import { AppComponent } from './app.component';

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
        path: 'kpis/builder',
        loadComponent: () =>
          import('./kpis/kpi-builder/kpi-builder.component').then(
            (c) => c.KpiBuilderComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    loadComponent: () =>
      import('./kpis/kpi-builder/kpi-builder.component').then(
        (c) => c.KpiBuilderComponent
      ),
  },
];
bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes, withHashLocation())],
});
