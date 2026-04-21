import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();
  const publicApiPaths = ['/categories/', '/items/', '/items/search/'];

  const isPublicRequest = publicApiPaths.some((path) => req.url.includes(path)) && req.method === 'GET';

  if (!token || isPublicRequest) {
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          authService.forceLogout();
        }
        return throwError(() => error);
      })
    );
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  ).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.forceLogout();
      }
      return throwError(() => error);
    })
  );
};
