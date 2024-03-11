import { IconNavItem } from 'techteec-lib/components/icon-side-nav';
import {
  ADD_ICON,
  ADMIN_ICON,
  COUNTER_ICON,
  DASHBOARD_ICON,
  DEVICE_ICON,
  HOME_ICON,
  KPI_ICON,
  LIST_ICON,
  REPORT_ICON,
  SHARE_ICON,
  SUBSET_ICON,
} from '../common/app-icons.const';
import { IconNavItemWithRoles } from './side-nav';
export const items: IconNavItemWithRoles[] = [
  {
    title: 'Home',
    svgIcon: HOME_ICON,
  },
  {
    title: 'KPI',
    svgIcon: KPI_ICON,
    postition: 'top',
    routerLink: 'kpis',
    children: [
      {
        title: 'All KPIS',
        svgIcon: LIST_ICON,
        routerLink: 'kpis/list'
      },
      {
        title: 'Create New',
        svgIcon: ADD_ICON,
        routerLink: 'kpis/devices',
        roles: ['editor', 'admin']
      },
    ],
  },
  // {
  //   title: 'Reports',
  //   svgIcon: REPORT_ICON,
  //   postition: 'top',
  //   children: [
  //     {
  //       title: 'All Reports',
  //       svgIcon: LIST_ICON,
  //     },
  //     {
  //       title: 'Create New',
  //       svgIcon: ADD_ICON,
  //     },
  //   ],
  // },
  // {
  //   title: 'Dashboards',
  //   svgIcon: DASHBOARD_ICON,
  //   postition: 'top',
  //   children: [
  //     {
  //       title: 'My Dashboards',
  //       svgIcon: LIST_ICON,
  //     },
  //     {
  //       title: 'Shared Dashboards',
  //       svgIcon: SHARE_ICON,
  //     },
  //     {
  //       title: 'Create New',
  //       svgIcon: ADD_ICON,
  //     },
  //   ],
  // },
  {
    title: 'Admin',
    svgIcon: ADMIN_ICON,
    postition: 'bottom',
    roles: ['admin'],
    children: [
      {
        title: 'Devices',
        svgIcon: DEVICE_ICON,
        routerLink: 'devices',
        
      },
      {
        title: 'Subsets',
        svgIcon: SUBSET_ICON,
        routerLink: 'subsets'
      },
      {
        title: 'Counters',
        svgIcon: COUNTER_ICON,
        routerLink: 'counters'        
      },
    ],
  },
];
