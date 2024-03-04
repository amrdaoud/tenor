import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, OnInit, inject } from '@angular/core';
import { Observable, catchError, finalize, isEmpty, switchMap, throwError } from 'rxjs';
import { appConfig } from '../app.config';
import { Token } from '@angular/compiler';
import { StartupService } from '../startup-service/startup.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements HttpInterceptor, OnInit {
  public startup = inject(StartupService);

  notTargetRequest = ['/Token', '/refreshToken'];

  constructor() {}
  ngOnInit(): void {}
 
 
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (!this.notTargetRequest.find((x) => req.url.includes(x))) {
      try {
        var token: any = localStorage.getItem('Token');
        req = req.clone({
          setHeaders: {
            Authorization: 'Bearer ' + JSON.parse(token.token),
          },
        });
      } catch (exception) {}
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          if (
            error?.status == 403 ||
            error?.status == 401 ||
            error?.message == 'Access Denied'
          ) {
            return this.refreshTokenMethod(req, next);
          } else {
            return throwError(() => error);
          }
        })
      );
    }
    return next.handle(req);
  }

  refreshTokenMethod(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.startup.refreshToken().pipe(
      switchMap((res: any) => {
        localStorage.setItem('Token', JSON.stringify(res));
        request = request.clone({
          setHeaders: {
            Authorization: 'Bearer ' + res.token,
          },
        });
        return next.handle(request);
      })
    );
  }
}
