import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { LoginService } from '../../../services/login.service';

import { SuperAdminService } from '../../../services/super-admin.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  userDeatils: any;

  constructor(private loginService: LoginService,
    public userService: UserService, private superAdminService: SuperAdminService) { }

  ngOnInit() {
    this.getUserDeatils();
  }


  getUserDeatils() {
    const currentUser = this.loginService.currentUser;

    this.userService.get({ email: currentUser.email }).subscribe((result: any) => {
      if (result.data) {
        this.currentUser = result.data[0];
        console.log(this.currentUser)
        this.superAdminService.getUserInfo(this.currentUser.id).subscribe((res: any) => {
          this.userDeatils = res.data;
          console.log(this.userDeatils)
        })
      }
    });
  }

}
