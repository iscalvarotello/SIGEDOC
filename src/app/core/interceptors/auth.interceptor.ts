import { HttpInterceptorFn } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { SesionService } from '@services/sesion.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { APP_SETTINGS } from '@metasystem/settings/app.settings';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const injector = inject(Injector);
  
  // Evitar dependencia circular leyendo localStorage o inyectando SesionService en tiempo de ejecución
  const token = localStorage.getItem(APP_SETTINGS.STORAGE_TOKEN);
  let institutionId = localStorage.getItem(APP_SETTINGS.STORAGE_TENANT_ID);
  
  if (!institutionId) {
    const userData = localStorage.getItem(APP_SETTINGS.STORAGE_USER_DATA);
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        institutionId = parsedUser.institution_id || null;
      } catch (e) {}
    }
  }

  let clonedReq = req;
  let headersToSet: any = {};

  if (token) {
    headersToSet['Authorization'] = `Bearer ${token}`;
  }
  if (institutionId) {
    headersToSet['x-institution-id'] = institutionId;
  }

  if (Object.keys(headersToSet).length > 0) {
    clonedReq = req.clone({
      setHeaders: headersToSet
    });
  }

  return next(clonedReq).pipe(
    catchError((error) => {
      // 401 Unauthorized - Token expirado o sesión inválida
      if (error?.status === 401) {
        const sesionService = injector.get(SesionService);
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
