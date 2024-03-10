import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, filter, first, switchMap, tap } from 'rxjs';
import { TokenDto } from '../models/account';
import { AccountService } from './account.service';
import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {
  isWaiting = false;
  refreshTokenSubject = new BehaviorSubject<TokenDto | null>(null);
  private accountService = inject(AccountService);
  handleRequest(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    if(!this.accountService.isTokenExpired()) {
      const newRequest = this.addTokenHeader(
        request, this.accountService.auth?.token
      )
      return next(newRequest);
    }
    if(this.isWaiting) {
      return this.waitedRefreshToken().pipe(
        switchMap(x => {
          const newRequest = this.addTokenHeader(request, x?.token);
          return next(newRequest);
        })
      )
    }
    else {
      return this.currentRefreshToken().pipe(
        switchMap(x => {
          const newRequest = this.addTokenHeader(request, x?.token)
          return next(newRequest);
        })
      )
    }
  }
  addTokenHeader(request: HttpRequest<unknown>, token: string | undefined | null): HttpRequest<unknown> {
    const authReq = request.clone({headers: request.headers.append('Authorization', 'bearer '+ token)});
    return authReq;
  }
  waitedRefreshToken(): Observable<TokenDto | null> {
    return this.refreshTokenSubject.pipe(
      filter(x => x !== null),
      first()
    )
  }
  currentRefreshToken(): Observable<TokenDto | null> {
    this.isWaiting = true;
    this.refreshTokenSubject.next(null);
    return this.accountService.login().pipe(
      tap(x => {
        this.isWaiting = false;
        this.refreshTokenSubject.next(x);
      })
    )
  }
}
