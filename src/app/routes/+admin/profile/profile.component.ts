import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any;

  constructor(
    private loginService: LoginService,
    public userService: UserService,
  ) { }

  ngOnInit() {
    const currentUser = this.loginService.currentUser;

    this.userService.get({ email: currentUser.email }).subscribe((result: any) => {
      if (result.data) {
        this.currentUser = result.data[0];
      }
    });
  }
}
