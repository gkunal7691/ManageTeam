import { Component, OnInit } from '@angular/core';
import { LoginService, AccountService } from '../../../services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any;

  constructor(
    private loginService: LoginService,
    public accountService: AccountService,
  ) { }

  ngOnInit() {
    const currentUser = this.loginService.currentUser;

    this.accountService.get({ email: currentUser.email }).subscribe((result: any) => {
      if (result.data) {
        this.currentUser = result.data[0];
      }
    });
  }
}
