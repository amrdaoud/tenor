import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { environment } from '../../environments/environment';
import { Token } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class StartupService {
  private url = environment.apiUrl + 'Token';
  constructor(private http: HttpClient) {}

  FindToken() {
    var token = localStorage.getItem('Token');
    if (token == null) {
      this.getToken().subscribe((x) => (token = x.token));
    }
    return token;
  }
  getToken(): Observable<any> {
    return this.http.get<any>(this.url).pipe();
  }

  refreshToken(): Observable<any> {
    return this.http.get<any>(this.url + '/ refreshToken').pipe();
  }
}
