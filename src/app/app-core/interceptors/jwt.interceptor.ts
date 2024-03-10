import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { RefreshTokenService } from '../services/refresh-token.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  if(req.url.toLowerCase().endsWith('/token') || req.url.toLowerCase().endsWith('/refreshtoken')) {
    return next(req);
  }
  return inject(RefreshTokenService).handleRequest(req, next);
};
