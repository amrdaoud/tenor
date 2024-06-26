import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';
export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
  submitted: boolean;
}
export const unsavedGuard: CanDeactivateFn<unknown> = (component, currentRoute, currentState, nextState) => {
  return (component as ComponentCanDeactivate).canDeactivate()
      ? true
      : // NOTE: this warning message will only be shown when navigating elsewhere within your angular app;
        // when navigating away from your angular app, the browser will show a generic warning message
        // see http://stackoverflow.com/a/42207299/7307355
        confirm('WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.');
};
