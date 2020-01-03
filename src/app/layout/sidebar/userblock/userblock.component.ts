import { Component, OnInit } from '@angular/core';
import { LoginService, AccountService } from '../../../services';
import { UserblockService } from './userblock.service';

@Component({
    selector: 'app-userblock',
    templateUrl: './userblock.component.html',
    styleUrls: ['./userblock.component.scss']
})
export class UserblockComponent implements OnInit {
    user: any;
    constructor(public userblockService: UserblockService,
        private loginService: LoginService,
        public accountService: AccountService
    ) {

        // this.user = {
        //     picture: 'assets/img/user/01.jpg'
        // };
    }

    ngOnInit() {
        const currentUser: any = this.loginService.currentUser;
        this.accountService.get({ email: currentUser.email }).subscribe((result: any) => {
            if (result.data) {
                this.user = result.data[0];
            }
        });
    }


    userBlockIsVisible() {
        return this.userblockService.getVisibility();
    }

}