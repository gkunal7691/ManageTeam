import { Component, OnInit } from '@angular/core';
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

  constructor(private loginService: LoginService, private superAdminService: SuperAdminService) { }

  ngOnInit() {
    this.getUserDeatils();
  }


  getUserDeatils() {
    this.currentUser = this.loginService.currentUser;
    this.superAdminService.getUserInfo(this.currentUser.id).subscribe((res: any) => {
      this.userDeatils = res.data;
    })
  }
}
