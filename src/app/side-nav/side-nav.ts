import { IconNavItem } from "techteec-lib/components/icon-side-nav";

export interface IconNavItemWithRoles extends IconNavItem {
    roles?: string[];
    children?: IconNavItemWithRoles[]
}