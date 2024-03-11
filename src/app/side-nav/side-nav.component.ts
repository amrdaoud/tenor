import { Component, inject } from '@angular/core';
import  {IconSideNavComponent} from 'techteec-lib/components/icon-side-nav';
import { items } from './side-nav.const';
import { AccountService } from '../app-core/services/account.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Unsubscriber } from 'techteec-lib/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, map } from 'rxjs';
import { IconNavItemWithRoles } from './side-nav';
import { TenantAccess } from '../app-core/models/account';
@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [IconSideNavComponent, CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatProgressSpinnerModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent extends Unsubscriber {
  
  private accountService = inject(AccountService);
  authData$ = this.accountService.authData$;
  logging$ = this.accountService.logging$;
  login() {
    this._otherSubscription = this.accountService.login().subscribe();
  }
  get authItems$(): Observable<IconNavItemWithRoles[]> {
    return this.authData$.pipe(
      map(data => this.getItemsByRoles(items, data?.userInfo?.tenantAccesses)!)
    )
  }
  getItemsByRoles(items: IconNavItemWithRoles[] | undefined, tenantAccesses: TenantAccess[] | undefined): IconNavItemWithRoles[] | undefined {
    if(tenantAccesses?.find(x => x.roleList.map(y => y.toLocaleLowerCase()).includes('superadmin'))) {
      return items;
    }
    if(!items || items.length === 0) {
      return [];
    }
    const roles = tenantAccesses?.map(x => x.roleList).flat(1).map(x => x.toLowerCase());
    return items?.filter(x => !x.roles || x.roles.length === 0 || x.roles.find(r => roles?.includes(r.toLowerCase()))).map(x => {
      if(x.children && x.children.length > 0) {
        x.children = this.getItemsByRoles(x.children, tenantAccesses);
        return x;
      } else {
        return x
      }
    })
  }
}
