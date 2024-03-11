import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, finalize, of, tap } from 'rxjs';
import { TokenDto } from '../models/account';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private url = environment.apiUrl + 'token';
  private http = inject(HttpClient);
  private Logging = new BehaviorSubject<boolean>(false);
  private authData = new BehaviorSubject<TokenDto | null>(null);
  get logging$(): Observable<boolean> {
    return this.Logging.asObservable();
  }
  get authData$(): Observable<TokenDto | null> {
    return this.authData.asObservable();
  }
  constructor() {
    this.authData.next(this.auth);
  }
  private storeAuth(model: TokenDto) {
    this.authData.next(model);
    localStorage.setItem('auth', JSON.stringify(model));
    
  }
  get auth(): TokenDto | null {
    const authString = localStorage.getItem('auth');
    if(!authString) {
      return null;
    }
    const auth = JSON.parse(authString) as TokenDto;
    return auth;
  }
  login(): Observable<TokenDto> {
    this.Logging.next(true);
    return this.http.get<TokenDto>(this.url, {withCredentials: true}).pipe(
      tap(x => this.storeAuth(x)),
      finalize(() => this.Logging.next(false))
    )
  }
  isTokenExpired(): boolean {
    return !this.auth || Date.now() >= new Date(this.auth.expiryTime).getTime()
  }
  

}
