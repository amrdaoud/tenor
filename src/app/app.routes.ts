import { Routes } from '@angular/router';

export const routes: Routes = [
    {path:'', loadComponent:() => import('./side-nav/side-nav.component').then(c => c.SideNavComponent), children: [
        {path: 'subsets', loadComponent: () => import('./subsets/subset-list/subset-list.component').then(c => c.SubsetListComponent)},
        {path: 'devices', loadComponent: () => import('./devices/device-list/device-list.component').then(c => c.DeviceListComponent)},
        {path: 'counters', loadComponent: () => import('./counters/counter-list/counter-list.component').then(c => c.CounterListComponent)}  
    ]}
];
