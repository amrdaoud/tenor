import {IconNavItem} from 'techteec-lib/components/icon-side-nav'
import { ADMIN_ICON, COUNTER_ICON, DEVICE_ICON, SUBSET_ICON } from '../common/app-icons.const'
export const items: IconNavItem[] = [
    {
        title: 'Admin',
        svgIcon: ADMIN_ICON,
        postition: 'bottom',
        children: [
            {
                title: 'Devices',
                svgIcon: DEVICE_ICON,
                routerLink: 'devices'
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
            }
        ]
    }, 
    
]