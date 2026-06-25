import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SesionService } from '../../shared/services/sesion.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const sesionService = inject(SesionService);
  const router = inject(Router);
  const token = sesionService.token();

  let clonedReq = req;
  if (token) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(clonedReq).pipe(
    catchError((error) => {
      // 401 Unauthorized - Token expirado o sesión inválida
      if (error?.status === 401) {
        sesionService.clearSession();
        router.navigate(['/signin']);
      }
      // 403 Forbidden - verificar si es debido a mantenimiento
      else if (error?.status === 403) {
        const errorMsg = error?.error?.message || error?.message || '';
        if (typeof errorMsg === 'string' && errorMsg.toLowerCase().includes('mantenimiento')) {
          router.navigate(['/maintenance']);
        }
      }
      return throwError(() => error);
    })
  );
};
