import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SesionService } from '../../shared/services/sesion.service';

export const authGuard: CanActivateFn = (route, state) => {
  const sesionService = inject(SesionService);
  const router = inject(Router);

  if (!sesionService.isLoggedIn()) {
    router.navigate(['/signin']);
    return false;
  }

  const user = sesionService.currentUserData();
  if (user && user.reset_password_required) {
    router.navigate(['/reset-password-required']);
    return false;
  }
  return true;
};
