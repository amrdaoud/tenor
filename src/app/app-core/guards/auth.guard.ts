import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { inject } from '@angular/core';
import { map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  if(!route.data['Roles'] || route.data['Roles'].length == 0) {
    return of(true);
  }
  const router = inject(Router);
  return inject(AccountService).authData$.pipe(
    map(x => x?.userInfo.tenantAccesses),
    map(tenantAccesses => tenantAccesses?.map(x => x.roleList).flat(1).map(x => x.toLowerCase())),
    map(roles => {
      if(roles?.includes('superadmin')) {
        return true
      }
      
      const canAccess =  (route.data['Roles'] as string[]).map(x => x.toLowerCase()).findIndex(x => roles?.includes(x)) > -1;
      if(!canAccess) {
        router.navigate(['/403'], {queryParams: {returnUrl: state.url}});
      }
      return canAccess;
    })
  )
};
