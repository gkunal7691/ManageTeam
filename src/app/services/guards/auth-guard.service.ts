import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { LoginService } from '../login.service';
import { CacheService } from '../cache.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private loginService: LoginService, private router: Router, private cacheService: CacheService) {
    }

    canActivate() {
        // if not --> redirect to login
        if (!this.cacheService.getCache('user')) {
            this.router.navigateByUrl('/login')
            return false;
        }
        return this.loginService.checkToken().then((data: any) => {
            this.loginService.setUser(data.user);
            return true;
        }).catch(() => {
            this.cacheService.removeCache('user');
            this.router.navigateByUrl('/login')
            return false;
        });
    }

}

