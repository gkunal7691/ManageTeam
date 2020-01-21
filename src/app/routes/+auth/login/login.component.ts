import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthLoadService } from '../../../core/load/auth.service';
import { CacheService } from '../../../services/cache.service';
import { LoginService } from '../../../services/login.service';
import { MESSAGES } from '../../../services/messages.service';



@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loginFailText: string;
    organizationId: number;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private loginservice: LoginService,
        private cacheService: CacheService,
        private authLoadService: AuthLoadService
    ) {
    }

    ngOnInit() {
        if (this.cacheService.getCache('user') != null) {
            let user = this.authLoadService.user;
            if (user.roleId == 1) {
                this.router.navigateByUrl('/employee/edashboard');
            } else if (user.roleId == 2) {
                this.router.navigateByUrl('/admin/adashboard');
            } else if (user.roleId == 3) {
                this.router.navigateByUrl('/systemadmin/sadashboard');
            }
        }

        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    onLogin() {
        this.loginFailText = null;
        if (!this.loginForm.valid) {
            return;
        } else {
            this.loginservice.login(
                this.loginForm.value.email,
                this.loginForm.value.password
            ).then((result: any) => {
                if (result.success) {
                    this.loginservice.checkToken().then((data: any) => {
                        console.log(data.user.roleId);
                        this.loginservice.setUser(data.user);
                        if (data.user.roleId == 1) {
                            this.router.navigateByUrl('/employee/edashboard');
                        }
                        else if (data.user.roleId == 2) {
                            this.router.navigateByUrl('/admin/adashboard');
                        }
                        else if (data.user.roleId == 3) {
                            this.router.navigateByUrl('/systemadmin/sadashboard');
                        }
                    }).catch(() => {
                        this.cacheService.removeCache('user');
                        this.router.navigateByUrl('/login')
                        return false;
                    });
                } else {
                    this.loginFailText = MESSAGES[result.error.name];
                }
            });
        }
    }
}