import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { MenuService } from '../../core/menu/menu.service';
import { LoginService } from '../login.service';
import { LoadService } from '../../core/org/load.service';

@Injectable()
export class ChildAuthGuard implements CanActivate {
    menuItems: any;
    currentUser: any;
    user :any;
    url:any
    constructor(private loginService: LoginService, private router: Router, private menu: MenuService,  private loadService: LoadService) {
        this.menuItems = menu.getMenu();
        this.currentUser = loginService.currentUser;
    }

    canActivate(state: ActivatedRouteSnapshot) {
        if(this.currentUser.roleId == 1)
        {
            this.url = this.menuItems.find(element => {return (element.link == `/employee/${state.url[0].path}`)});
        }
        else if(this.currentUser.roleId == 2)
        {
            this.url = this.menuItems.find(element => {return (element.link == `/admin/${state.url[0].path}`)});
        }
        else if(this.currentUser.roleId == 3)
        {
            this.url = this.menuItems.find(element => {return (element.link == `/superadmin/${state.url[0].path}`)});
        }
      
        if (this.url !== undefined && this.url.link.includes("employee")) {
            if (!this.url.roleId) {
                return true;
            }
            let isAllowed = this.url.roleId.find(id => id == this.currentUser.roleId);
            if (isAllowed !== undefined) {
                return true;
            }
            this.router.navigate(['/employee/edashboard']);
            return false;
        } 
        else if (this.url !== undefined && this.url.link.includes("admin"))
        {
            if (!this.url.roleId) {
                return true;
            }
            let isAllowed = this.url.roleId.find(id => id == this.currentUser.roleId);
            if (isAllowed !== undefined) {
                return true;
            }
            this.router.navigate(['/admin/adashboard']);
            return false;
        }
        else if (this.url !== undefined && this.url.link.includes("superadmin"))
        {
            if (!this.url.roleId) {
                return true;
            }
            let isAllowed = this.url.roleId.find(id => id == this.currentUser.roleId);
            if (isAllowed !== undefined) {
                return true;
            }
            this.router.navigate(['/superadmin/sdashboard']);
            return false;
        }
        this.router.navigate(['/login']);
        return false;
    }

}

