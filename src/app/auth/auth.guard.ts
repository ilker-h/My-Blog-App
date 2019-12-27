import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

// a guard is just a service, which is a class

@Injectable()
export class AuthGuard implements CanActivate {

constructor(private authService: AuthService, private router: Router) {

}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {

        const isAuth = this.authService.getIsAuth();

        // throw new Error('Method not implemented.');
        // If we return true, the router will know that the route which you were protecting is now accessible.
        // If it returns false, the router will deny to go there.
        //
        // return true;

        if (!isAuth) {
            this.router.navigate(['/auth/login']);
        }
        return isAuth;
    }

}

// A Guard means Angular adds some interfaces that your classes can implement, which forces the classes to add certain
// methods that the Angular Router can execute before it loads a route to check whether it should proceed or
// do something else. One example is an interface which helps us with protecting routes is the CanActivate interface.
