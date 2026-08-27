import { inject } from '@angular/core';
import {
    CanActivateFn,
    Router
} from '@angular/router';
import {AuthService} from "./auth.service";

export const adminGuard: CanActivateFn = async () => {

    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        return true;
    }

    return router.createUrlTree([
        '/admin/login'
    ]);
};
